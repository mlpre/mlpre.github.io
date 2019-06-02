# Java解析XML文件的常用方法介绍

XML是一个可扩展标记语言。很多时候我们需要进行数据交换，同时也存在跨平台使用，XML文件对这些需求提供了很好的帮助！

对于Java来说，XML常见的用途就是保存数据和配置，这就涉及了对XML文件的增删改查操作！

Java常见的XML解析方式分为DOM解析、SAX解析、DOM4j解析，下面是这三种解析方式的优缺点：

1. DOM解析

方便遍历，随机访问某一个节点，修改XML。缺点是一次性读取到内存。

2. SAX解析

从上至下一个个节点去解析，触发事件（调用相应的方法）来进行处理。不能对xml进行修改。占用内存小。

3. DOM4j
第三方的开源的解析工具，方便使用。

#### XML文件：(src/name.xml)

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<names>
    <name id="张三">
        <age>20</age>
    </name>
    <name id="李四">
        <age>25</age>
    </name>
    <name id="王五">
        <age>30</age>
    </name>
</names>
```

#### 下面我就来介绍DOM和DOM4j来解析上面的XML文件的方法：

1. DOM解析：

```java
import java.io.IOException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class DOM {

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            // 创建DOM解析器工厂
            DocumentBuilder db = dbf.newDocumentBuilder();
            // 调用DOM解析器工厂的newDocumentBuilder()方法得到DOM解析器对象
            Document doc = db.parse("src\\name.xml");
            // 调用DOM解析器对象parse(String uri)方法得到Document对象
            NodeList nl = doc.getElementsByTagName("name");
            // 调用Document对象的getElementsByTagName(String tagname)方法得到NodeList对象
            /*
             * 遍历XML中的元素
             */
            for (int i = 0; i < nl.getLength(); i++) {
                Node node = nl.item(i);
                // 通过NodeList的item(int index)方法得到NodeList中的Node对象
                Element element = (Element) node;
                // 通过Node对象强制转换的方法得到Element对象
                String id = element.getAttribute("id");
                // 通过Element对象的getgetAttribute(String name)方法得到id属性值
                System.out.println(id);
                // 打印id属性值
                String age = element.getElementsByTagName("age").item(0).getTextContent();
                // 通过Element对象的getElementsByTagName(String name)方法得到age的属性值
                System.out.println(age);
                // 打印age
            }
            /*
             * 添加元素到XML中
             */
            Element root = doc.getDocumentElement();
            // 通过Document对象的getDocumentElement()方法得到根节点
            Element newname = doc.createElement("name");
            // 通过Document对象的createElement(String tagName)方法得到新的name元素
            newname.setAttribute("id", "小明");
            // 通过调用Element对象的setAttribute(String name,String value)方法为id赋值
            Element newage = doc.createElement("age");
            // 通过Document对象的createElement(String tagName)方法得到新的age元素
            newage.setTextContent("18");
            // 通过调用Element对象的setTextContent(String textContent)方法为age赋值
            newname.appendChild(newage);
            // 添加age到name中
            root.appendChild(newname);
            // 添加name到根节点中
            /*
             * 修改XML中的元素
             */
            for (int i = 0; i < nl.getLength(); i++) {
                Element fixname = (Element) nl.item(i);
                // 得到要修改的Element对象
                String fixnewname = fixname.getAttribute("id");
                // 获取到要修改对象的id属性值
                /*
                 * 判断name是否为要修改的对象
                 */
                if (fixnewname.equals("小明")) {
                    Element sex = doc.createElement("sex");
                    // 创建新的Element对象
                    sex.setAttribute("sex", "男");
                    // 给新的Element对象的属性赋值
                    fixname.appendChild(sex);
                    // 添加新的Element(sex)对象到Element(fixname)对象中
                }
            }
            /*
             * 删除XML中的元素
             */
            root.removeChild(root.getChildNodes().item(7));
            // 首先通过根节点访问子节点，得到Node对象，然后调用根节点的removeChild(Node oldChild)方法删除元素
            /*
             * 将更改写入到XML文件中
             */
            TransformerFactory tf = TransformerFactory.newInstance();
            // 调用TransformerFactory的newInstance()方法得到TransformerFactory对象
            Transformer t = tf.newTransformer();
            // 调用TransformerFactory对象的newTransformer()方法得到Transformer对象
            t.transform(new DOMSource(doc), new StreamResult("src\\name.xml"));
            // 调用Transformer对象的transform(Source xmlSource,Result
            // outputTarget)方法将修改写入到name.xml文件中
        } catch (ParserConfigurationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SAXException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (TransformerConfigurationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (TransformerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}
```

2. DOM4j解析：

```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public class DOM4j {

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        try {
            // 遍历
            SAXReader sr = new SAXReader();
            Document doc = sr.read("src\\name.xml");
            Element root = doc.getRootElement();
            List<Element> name = root.elements("name");
            for (Element names : name) {
                System.out.println(names.attributeValue("id"));
                List<Element> age = names.elements("age");
                for (Element ages : age) {
                    System.out.println(ages.getText());
                }
            }
            // 添加
            Element newname = root.addElement("name");
            newname.addAttribute("id", "小明");
            Element newage = newname.addElement("age");
            newage.setText("18");
            //删除
            root.remove(name.get(3));
            // 写入
            XMLWriter xw = new XMLWriter(new FileOutputStream("src\\name.xml"));
            xw.write(doc);
        } catch (DocumentException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}
```
