# Mybatis注解和配置文件命名规范所引发的问题

报错如下：

Access denied for user 'Minli'@'localhost' (using password: YES)

根据提示，应该是Mysql的用户名和密码错误导致的问题，查看database配置文件，也没有发现问题。

database配置文件：

```
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/hotel
username=root
password=root
```

然后查看了一下Dao接口：

```java
package cn.hotel.dao;

import cn.hotel.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserDao {
    public User login(@Param("username") String username, @Param("password") String password, @Param("status") Integer status);

    public Integer add(User user);

    public Integer update(User user);

    public User getUserById(Integer id);

    public List<User> getAllUser();
}
```

很寻常的CRUD，应该不至于出现问题。

然后查看了Spring的配置文件，关于dataSource的配置是这样的：

```xml
<context:property-placeholder location="classpath:database.properties"/>

<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
</bean>
```

一直这样使用也没有问题。但是忽然发现一点，在配置文件中Mybatis的命名和@Param中参数的命名都是一致的，会不会是这个原因导致的呢。

于是修改database配置文件：

```
database.driver=com.mysql.jdbc.Driver
database.url=jdbc:mysql://localhost:3306/hotel
database.username=root
database.password=root
```

修改Spring配置文件dataSource部分：

```xml
<context:property-placeholder location="classpath:database.properties"/>

<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${database.driver}"/>
        <property name="url" value="${database.url}"/>
        <property name="username" value="${database.username}"/>
        <property name="password" value="${database.password}"/>
</bean>
```

问题得到解决！

### 总结：

在使用Mybatis带@Param参数注解功能时，要避免名称和数据库配置文件对应的字段名称相同，否则就会出现无法连接数据库的情况。
