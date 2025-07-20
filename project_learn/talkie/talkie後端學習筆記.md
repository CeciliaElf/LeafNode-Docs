# talkie 後端學習筆記

## 初始化專案

🔗參考鏈接：https://coderlaoluo.feishu.cn/wiki/XrV6wZ7PliEeuak2NCXclC84nRf

### 手動創建 springboot 專案

打開專案文件夾，創建`src`目錄和`pom.xml`目錄。

最終專案結構如下

```txt
talkie/
├── src/
│   ├── java/
│   └── resources/
└── pom.xml
```

### pom.xml 所使用到的依賴

#### Maven 依賴列表

| 依賴 (Dependency)                | 版本 (Version) | 用途 (Purpose)                                               |
| :------------------------------- | :------------- | :----------------------------------------------------------- |
| `spring-boot-starter-web`        | 2.6.1          | Spring Boot Web Starter，用於構建基於 Spring MVC 的 Web 應用程式，包含內嵌的 Tomcat、Spring MVC 等核心組件。 |
| `spring-boot-starter-validation` | 2.6.1          | Spring Boot Validation Starter，提供 JSR-303/JSR-349 Bean Validation API 的實現，用於數據校驗。 |
| `spring-boot-starter-data-redis` | 2.6.1          | Spring Boot Redis Starter，用於整合 Spring Data Redis，方便在 Spring 應用中使用 Redis 作為數據緩存或消息代理。 |
| `mybatis-spring-boot-starter`    | 1.3.2          | MyBatis Spring Boot Starter，用於整合 MyBatis 持久層框架到 Spring Boot 應用中，簡化數據庫操作。 |
| `mysql-connector-java`           | 8.0.23         | MySQL JDBC Driver，用於 Java 應用程式連接 MySQL 數據庫。     |
| `logback-classic`                | 1.2.10         | Logback 日誌框架的核心模塊，提供日誌記錄功能。               |
| `logback-core`                   | 1.2.10         | Logback 日誌框架的核心基礎模塊。                             |
| `aspectjweaver`                  | 1.9.4          | AspectJ Weaver，提供 AOP (Aspect-Oriented Programming) 功能，用於在運行時織入切面。 |
| `okhttp`                         | 3.2.0          | OkHttp，一個高效的 HTTP 客戶端，用於發送 HTTP 請求和處理響應。 |
| `fastjson`                       | 1.2.66         | 阿里巴巴開源的高性能 JSON 庫，用於 Java 對象和 JSON 字符串之間的序列化和反序列化。 |
| `commons-lang3`                  | 3.4            | Apache Commons Lang 3，提供各種實用工具類，擴展了 Java 標準庫的功能，例如字符串操作、數組操作等。 |
| `commons-codec`                  | 1.9            | Apache Commons Codec，提供通用的編碼/解碼算法，例如 Base64、MD5、SHA1 等。 |
| `commons-io`                     | 2.5            | Apache Commons IO，提供 IO 操作的實用工具類，簡化文件和流的處理。 |
| `easy-captcha`                   | 1.6.2          | Easy Captcha，一個簡單易用的驗證碼生成庫。                   |
| `netty-all`                      | 4.1.50.Final   | Netty All，一個高性能、異步事件驅動的網絡應用程式框架，用於快速開發可維護的高性能協議服務器和客戶端。 |
| `redisson`                       | 3.12.3         | Redisson，一個基於 Redis 的 Java 驅動，提供豐富的分布式對象和服務，如分布式鎖、Map、Set 等。 |