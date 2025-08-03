 # @Autowired vs @Resource in Spring Boot

Spring Boot 提供了多種依賴注入的方式，其中 `@Autowired` 和 `@Resource` 是最常用的兩個注解。這篇筆記將深入解釋這兩個注解的區別、適用場景及具體使用方法。

## 基本概念

### @Autowired

- 來源：Spring 框架提供 (org.springframework.beans.factory.annotation.Autowired)
- 注入方式：**默認按類型注入** (by type)
- 可以搭配 `@Qualifier` 實現按名稱注入

### @Resource

- 來源：Java 標準庫 (javax.annotation.Resource)，Java EE 的一部分
- 注入方式：**默認按名稱注入** (by name)，如果找不到名稱匹配的 bean，則按類型注入
- 可以通過 `name` 屬性顯式指定 bean 名稱

## 基本使用案例

### 案例 1: 單一實現的注入

假設我們有一個服務接口和它的實現：

```java
// 服務接口
public interface UserService {
    String getUserInfo(Long id);
}

// 服務實現
@Service
public class UserServiceImpl implements UserService {
    @Override
    public String getUserInfo(Long id) {
        return "用戶 ID: " + id;
    }
}

// 控制器 - 使用 @Autowired
@RestController
@RequestMapping("/api/user")
public class UserController {
    // 使用 @Autowired 注入
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id) {
        return userService.getUserInfo(id);
    }
}

// 另一個控制器 - 使用 @Resource
@RestController
@RequestMapping("/api/user2")
public class UserController2 {
    // 使用 @Resource 注入
    @Resource
    private UserService userService;
    
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id) {
        return userService.getUserInfo(id);
    }
}
```

在這個案例中，兩種注入方式的效果完全相同，因為 `UserService` 只有一個實現類。

**輸出結果**：訪問 `/api/user/1` 或 `/api/user2/1`，都會返回 `用戶 ID: 1`

### 案例 2: 多實現類的注入

當接口有多個實現類時，區別就明顯了：

```java
// 服務接口
public interface MessageService {
    String sendMessage(String content);
}

// 實現類 1
@Service("emailService")
public class EmailServiceImpl implements MessageService {
    @Override
    public String sendMessage(String content) {
        return "通過電子郵件發送: " + content;
    }
}

// 實現類 2
@Service("smsService")
public class SMSServiceImpl implements MessageService {
    @Override
    public String sendMessage(String content) {
        return "通過短信發送: " + content;
    }
}
```

#### 使用 @Autowired

```java
@RestController
@RequestMapping("/api/message")
public class MessageController {
    // 會報錯！因為存在多個 MessageService 的實現
    @Autowired
    private MessageService messageService;
    
    // 正確做法: 使用 @Qualifier 指定 bean 名稱
    @Autowired
    @Qualifier("emailService")
    private MessageService emailService;
    
    @Autowired
    @Qualifier("smsService")
    private MessageService smsService;
    
    @GetMapping("/email/{content}")
    public String sendEmail(@PathVariable String content) {
        return emailService.sendMessage(content);
    }
    
    @GetMapping("/sms/{content}")
    public String sendSMS(@PathVariable String content) {
        return smsService.sendMessage(content);
    }
}
```

#### 使用 @Resource

```java
@RestController
@RequestMapping("/api/message2")
public class MessageController2 {
    // 指定名稱注入
    @Resource(name = "emailService")
    private MessageService emailService;
    
    // 也可以通過變量名自動匹配 bean 名稱
    @Resource
    private MessageService smsService; // 會找名為 "smsService" 的 bean
    
    @GetMapping("/email/{content}")
    public String sendEmail(@PathVariable String content) {
        return emailService.sendMessage(content);
    }
    
    @GetMapping("/sms/{content}")
    public String sendSMS(@PathVariable String content) {
        return smsService.sendMessage(content);
    }
}
```

**輸出結果**：
- 訪問 `/api/message/email/hello`：`通過電子郵件發送: hello`
- 訪問 `/api/message/sms/hello`：`通過短信發送: hello`
- 訪問 `/api/message2/email/hello`：`通過電子郵件發送: hello`
- 訪問 `/api/message2/sms/hello`：`通過短信發送: hello`

### 案例 3: 構造器注入與屬性注入

使用 `@Autowired` 的構造器注入 (推薦使用):

```java
@Service
public class OrderService {
    private final UserService userService;
    private final PaymentService paymentService;
    
    // 構造器注入
    @Autowired
    public OrderService(UserService userService, PaymentService paymentService) {
        this.userService = userService;
        this.paymentService = paymentService;
    }
    
    public String createOrder(Long userId, Double amount) {
        String userInfo = userService.getUserInfo(userId);
        String paymentResult = paymentService.processPayment(amount);
        return "訂單創建: " + userInfo + ", " + paymentResult;
    }
}
```

使用 `@Resource` 的屬性注入:

```java
@Service
public class OrderService2 {
    @Resource
    private UserService userService;
    
    @Resource
    private PaymentService paymentService;
    
    public String createOrder(Long userId, Double amount) {
        String userInfo = userService.getUserInfo(userId);
        String paymentResult = paymentService.processPayment(amount);
        return "訂單創建: " + userInfo + ", " + paymentResult;
    }
}
```

**注意**: `@Resource` 不支持在構造器上使用，主要用於屬性和 setter 方法。

## 主要區別總結

| 特性 | @Autowired | @Resource |
|------|------------|-----------|
| 來源 | Spring 框架 | Java 標準庫 (Java EE) |
| 默認注入方式 | 按類型 (by type) | 按名稱 (by name)，找不到再按類型 |
| 需要指定名稱時 | 需配合 @Qualifier 使用 | 直接使用 name 屬性 |
| 可以用於 | 屬性、構造器、setter 方法 | 屬性、setter 方法 |
| 當找不到 bean 時 | 默認報錯，可通過 required=false 改變行為 | 默認報錯 |

## 使用建議

1. **優先選擇 @Autowired**：
   - 如果你的項目全部基於 Spring 框架
   - 需要構造器注入時
   - 需要使用更多 Spring 特有功能時

2. **優先選擇 @Resource**：
   - 如果你的項目需要兼容 Java EE 標準
   - 當你更喜歡按名稱注入而不是按類型注入
   - 當你不希望引入 Spring 特有的依賴

3. **最佳實踐**：
   - 在同一個項目中，盡量統一使用一種注入方式，保持一致性
   - 對於單一實現的服務，兩種方式效果相同
   - 對於多實現的服務，明確指定你需要的具體實現

## 總結

`@Autowired` 和 `@Resource` 是 Spring Boot 中兩種常見的依賴注入方式，它們各有優缺點：

- `@Autowired` 默認按類型注入，需要配合 `@Qualifier` 指定名稱，支持構造器注入
- `@Resource` 默認按名稱注入，可以直接通過 `name` 屬性指定 bean 名稱，但不支持構造器注入

在實際開發中，可以根據項目需求和團隊習慣選擇合適的注入方式。

無論使用哪種方式，依賴注入都是實現松耦合、提高代碼可測試性的重要手段，是 Spring 框架的核心優勢之一。