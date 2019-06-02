# Java包装类介绍与类型之间相互转换

### 1、包装类存在的意义

通俗解释就是由于Java是面对对象的语言，而基本类型不具有面对对象的概念，为了弥补不足，引入了包装类方便使用面对对象的变成思想操作基本类型。

### 2、基本类型和包装类对应关系

byte	Byte

int		Integer

short	Short

long	Long

float	Float

double	Double

boolean	Boolean

char	Character

注：String不是基本类型，所以不存在包装类的概念。很多初学者容易混淆这个概念。

### 3、包装类的使用

以Integer类为例，其它类可以翻阅API文档查阅：

```java
public static void main(String[] args) {
    Integer i = new Integer(5);// 通过构造函数把int类型转换为Integer类型。
    Integer j = new Integer("5");// 通过构造函数把String类型的数值转为int类型后再转为Integer类型，如果String中不包含数值，则会出现异常。
    int temp = 10;
    Integer m = temp;// 自动装箱
    Integer n = new Integer(temp);// 自动装箱
    int x = m.intValue();// 手动拆箱
    int y = n;// 自动拆箱
    System.out.println(i + "\t" + j + "\t" + m + "\t" + n + "\t" + x + "\t" + y);
}
```

### 4、基本类型与包装类转换为String

1. 使用toString转换

```java
public static void main(String[] args) {
    int i = 50;
    String str = Integer.toString(i);//自动装箱并调用toString()方法，这也是将基本类型转换为包装类的好处。
    System.out.println(str);
}
```

2. 使用valueOf转换

```java
public static void main(String[] args) {
    String str = String.valueOf("10");
    System.out.println(str);
}
```

3. 数字+""方法

```java
public static void main(String[] args) {
    int i = 100;
    String str = i + "";
    System.out.println(str);
}
```

### 5、包装类转换为基本类型

```java
public static void main(String[] args) {
    Integer i = new Integer("20");
    int m = i.intValue();
    System.out.println(m);
}
```

### 6、字符串转换为基本类型

```java
public static void main(String[] args) {
    int i = Integer.parseInt("50");
    System.out.println(i);
}
```
