 # Redis工具類詳解：RedisUtils類完整解析

這個`RedisUtils`類是一個Redis操作工具類，封裝了Redis常用的字符串(String)和列表(List)操作。下面將從淺入深地解析每個方法。

## 基本結構與組件

```java
@Component("redisUtils")
public class RedisUtils<V> {
    @Resource
    private RedisTemplate<String, V> redisTemplate;

    private static final Logger logger = LoggerFactory.getLogger(RedisUtils.class);
}
```

- `@Component("redisUtils")`: 標記為Spring組件，命名為"redisUtils"，可在其他類中通過`@Resource(name="redisUtils")`注入
- `<V>`: 泛型參數，表示Redis值的類型，使工具類可以處理任何類型的值
- `RedisTemplate`: Spring Data Redis的核心類，提供各種Redis操作
- `Logger`: 用於記錄操作日誌，特別是異常情況

## 方法詳解

### 1. 刪除緩存

```java
/**
 * 删除缓存
 *
 * @param key 可以传一个值或者多个
 */
public void delete(String ...key) {
    if (key != null && key.length > 0) {
        if (key.length == 1) {
            redisTemplate.delete(key[0]);
        } else {
            redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
        }
    }
}
```

這個方法允許刪除一個或多個Redis鍵：
- 使用可變參數(`String ...key`)接收任意數量的鍵
- 根據參數數量選擇合適的刪除方法
- 多個鍵時，先將數組轉為集合再批量刪除

### 2. 獲取值

```java
/**
 * 获取缓存值
 *
 * @param key 键名
 * @return 值，如果键不存在则返回null
 */
public V get(String key) {
    return key == null ? null : redisTemplate.opsForValue().get(key);
}
```

從Redis獲取指定鍵對應的值：
- 如果鍵為null，直接返回null
- 否則使用`opsForValue().get(key)`獲取值

### 3. 設置值

```java
/**
 * 普通缓存放入
 * 
 * @param key 键名
 * @param value 值
 * @return 操作是否成功
 */
public boolean set(String key, V value) {
    try {
        redisTemplate.opsForValue().set(key, value);
        return true;
    } catch (Exception e) {
        logger.error("设定 redisKey: (), value: {} 失败", key, value);
        return false;
    }
}
```

向Redis存入鍵值對：
- 使用try-catch處理可能的異常
- 出錯時記錄日誌並返回false
- 成功時返回true

### 4. 設置帶過期時間的值

```java
/**
 * 普通缓存放入并设置时间
 * 
 * @param key 键名
 * @param value 值
 * @param time 过期时间(秒)，如果time小于等于0则设置无过期时间
 * @return 操作是否成功
 */
public boolean setex(String key, V value, long time) {
    try {
        if (time > 0) {
            redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
        } else {
            set(key, value);
        }
        return true;
    } catch (Exception e) {
        logger.error("设定 redisKey: (), value: {} 失败", key, value);
        return false;
    }
}
```

設置帶過期時間的鍵值對：
- `time`參數指定過期時間（秒）
- 如果time>0，設置帶過期時間的值
- 否則調用普通的set方法
- `TimeUnit.SECONDS`指定時間單位為秒

### 5. 設置過期時間

```java
/**
 * 设置指定键的过期时间
 *
 * @param key 键名
 * @param time 过期时间(秒)，如果time小于等于0则不设置过期时间
 * @return 操作是否成功
 */
public boolean expire(String key, long time) {
    try {
        if (time > 0) {
            redisTemplate.expire(key, time, TimeUnit.SECONDS);
        }
        return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
```

為已存在的鍵設置過期時間：
- 只有當time>0時才設置過期時間
- 直接使用`redisTemplate.expire`方法而不是通過操作特定類型

### 6. 獲取列表所有元素

```java
/**
 * 获取指定键存储的列表的所有元素
 *
 * @param key 列表键名
 * @return 列表中的所有元素，如果键不存在返回空列表
 */
public List<V> getQueueList(String key) {
    return redisTemplate.opsForList().range(key, 0, -1);
}
```

獲取Redis列表的所有元素：
- 使用`opsForList().range`方法
- 參數`0, -1`表示獲取從第一個到最後一個元素
- 返回值為Java的List類型

### 7. 向列表左側添加元素

```java
/**
 * 将值插入到列表的左侧(头部)并设置过期时间
 *
 * @param key 列表键名
 * @param value 要插入的值
 * @param time 过期时间(秒)，如果time小于等于0则不设置过期时间
 * @return 操作是否成功
 */
public boolean lpush(String key, V value, long time) {
    try {
        redisTemplate.opsForList().leftPush(key, value);
        if (time > 0) {
            expire(key, time);
        }
        return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
```

向列表左側（頭部）添加元素：
- 使用`opsForList().leftPush`方法添加元素
- 如果指定了過期時間，則設置鍵的過期時間
- 此操作類似於Java中的`List.add(0, element)`

### 8. 從列表中移除元素

```java
/**
 * 从列表中移除指定的元素
 *
 * @param key 列表键名
 * @param value 要移除的元素值
 * @return 成功移除的元素数量
 */
public long remove(String key, Object value) {
    try {
        Long remove = redisTemplate.opsForList().remove(key, 1, value);
        return remove;
    } catch (Exception e) {
        e.printStackTrace();
        return 0;
    }
}
```

從列表中移除元素：
- `opsForList().remove(key, count, value)`方法
- `count=1`表示從頭到尾移除1個與`value`相等的元素
- 返回實際移除的元素數量

### 9. 批量添加列表元素

```java
/**
 * 将多个值一次性插入到列表的左侧(头部)并设置过期时间
 *
 * @param key 列表键名
 * @param values 要插入的值的集合
 * @param time 过期时间(秒)，如果time小于等于0则不设置过期时间
 * @return 操作是否成功
 */
public boolean lpushAll(String key, List<V> values, long time) {
    try {
        redisTemplate.opsForList().leftPushAll(key, values);
        if (time > 0) {
            expire(key, time);
        }
        return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
```

批量向列表左側添加元素：
- 使用`opsForList().leftPushAll`方法一次添加多個元素
- 如果指定了過期時間，則設置鍵的過期時間
- 比多次調用`leftPush`更高效

## RedisTemplate與opsForXXX方法詳解

### RedisTemplate

`RedisTemplate`是Spring Data Redis提供的核心類，負責：
- 處理與Redis服務器的連接
- 轉換Java對象和Redis數據格式
- 提供事務和異常處理
- 通過不同的操作接口訪問各種Redis數據類型

在本工具類中，`RedisTemplate<String, V>`指定鍵為String類型，值為泛型V。

### opsForXXX系列方法

RedisTemplate提供了一系列`opsForXXX`方法，每個方法返回對應一種Redis數據結構的操作接口：

1. **opsForValue()** - 操作String類型的值
   - `get(key)`: 獲取值
   - `set(key, value)`: 設置值
   - `set(key, value, timeout, unit)`: 設置帶過期時間的值
   - `increment(key, delta)`: 增加值

2. **opsForList()** - 操作List類型的值
   - `leftPush(key, value)`: 向列表左側添加元素
   - `rightPush(key, value)`: 向列表右側添加元素
   - `leftPushAll(key, values)`: 批量向左側添加元素
   - `rightPushAll(key, values)`: 批量向右側添加元素
   - `range(key, start, end)`: 獲取列表指定範圍的元素
   - `size(key)`: 獲取列表長度
   - `remove(key, count, value)`: 移除列表中的元素

3. **opsForHash()** - 操作Hash類型的值
   - `put(key, hashKey, value)`: 設置哈希表中的字段值
   - `get(key, hashKey)`: 獲取哈希表中的字段值
   - `entries(key)`: 獲取哈希表中所有的字段和值

4. **opsForSet()** - 操作Set類型的值
   - `add(key, values)`: 向集合添加元素
   - `members(key)`: 獲取集合的所有元素
   - `isMember(key, value)`: 判斷元素是否是集合的成員

5. **opsForZSet()** - 操作ZSet（有序集合）類型的值
   - `add(key, value, score)`: 向有序集合添加元素
   - `range(key, start, end)`: 獲取有序集合指定範圍的元素
   - `score(key, value)`: 獲取有序集合成員的分數

## 通用性與代碼提煉

### 通用性評估

這個`RedisUtils`類是非常通用的，可以在任何需要使用Redis的Spring項目中使用，因為：

1. 它封裝了最常用的Redis操作
2. 使用泛型支持各種類型的值
3. 有完善的異常處理和日誌記錄
4. 方法命名直觀，接口簡潔

### 通用代碼片段提煉

如果你需要在項目中使用Redis，可以直接使用這個工具類，或者根據需要提取以下核心片段：

```java
@Component
public class RedisUtils<V> {
    @Resource
    private RedisTemplate<String, V> redisTemplate;
    
    // 基本字符串操作
    public V get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }
    
    public boolean set(String key, V value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // 過期時間設置
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    // 列表操作
    public List<V> getList(String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }
    
    public boolean addToList(String key, V value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

這個簡化版本包含了最基本的Redis操作，可以根據項目需求添加更多功能。

## 總結

這個`RedisUtils`類是一個功能完整的Redis操作工具類，提供了字符串和列表類型的基本操作。通過使用Spring的`RedisTemplate`，它簡化了Redis的使用，處理了底層連接和異常，可以在任何Spring項目中方便地集成和使用。

如果你的項目需要使用Redis，這個工具類是一個很好的起點，可以根據實際需求進行擴展，添加更多的Redis數據類型操作和高級功能。

Cecilia 在 2025/08/04 的筆記

Thanks♪(･ω･)ﾉ