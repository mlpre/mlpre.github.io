**起因**

&emsp;&emsp;最近刚刚结束考研，开始有时间写文章了。在复习的时候中，经常忍不住折腾各种东西，于是有一天看中了我手上的华为路由器。什么？华为路由器，你可能有这样的疑问，华为路由器不是自研的芯片吗，就像我手上这台华为路由器，是华为自己研发的凌霄芯片，没有对外开放，怎么折腾呢？于是就有了以下的研究历程。

**折腾什么**

&emsp;&emsp;首先，能够折腾什么呢？就像我手上的树莓派一样，刷个OpenWrt系统轻而易举。可能有些人会有一些疑问，OpenWrt系统是什么？其实这就是一个开源的路由器操作系统，很多路由器的系统都是在此基础上进行开发的，这个系统的可玩性很高。但是华为路由器连固件下载都没有开放，折腾系统这条路就不太合适了。开发路由器插件呢？貌似可行，但此时我只知道路由器插件只能在华为路由器专用的市场上安装，而且路由器买了几年了，也就那么几个插件，主要都是IOT家电控制类的应用，但是这条路理论上可行，于是决定折腾路由器插件开发。

**申请Debug版本固件**

&emsp;&emsp;目前华为路由器只要是有插件应用市场的，理论上都支持路由器插件开发，其它品牌的路由器很多也是支持的，不过每种路由器开发的方式都不一样，可以参考官方提供的文档。目前我手上只有华为的路由器，型号是荣耀路由Pro2，这是几年前的一个路由器，已经都下市了，固件也不更新了，通过华为官网的文档，我发送路由器序列号给华为联系邮箱，等待路由器适配完成，更新一下固件，就转到了Debug版本。

**了解插件系统**

&emsp;&emsp;华为路由器运行了OpenEE开发平台，插件就是在此基础上进行开发，同时路由器硬件通过OSGI接口对外提供调用能力，插件运行在JVM上。JVM？没错，就是我们Java程序员喜欢的JVM。Debug版本可以直接用root用户登录到路由器运行的后台，基本Linux的命令都是支持的。然后我找到了路由器上的JVM研究了一下，其实就是研究了一下rt.jar的源码，这个JVM是极度精简的版本，很多和路由器运行无关类都去掉了，并且加了很多华为自己写的类，不过我们编写程序最常用的类还是没有精简的。

&emsp;&emsp;插件开发分为前端和后端，后端可以基于JVM开发API接口供前端调用，前端可以直接使用HTML等任意前端技术进行开发，不过需要调用后端的API只能使用特定的函数，最后上传开发好的应用到路由器即可运行，同时应用也可以在路由器市场直接打开运行、卸载。

<img src="https://p6.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/38c3f342f81941c29c596678bbb44a9f~tplv-obj.jpg"/>

插件系统原理图

**跑通Demo**

&emsp;&emsp;可以根据官方文档进行操作，在这里我就不贴出链接了，大家如果有开发的需求，可以直接在华为开发者官网去搜索路由器开发文档即可，也可以和我讨论。首先，需要准备开发环境，JDK1.8、Maven基本就够了，然后运行官方脚本向Maven本地库导入几个华为自己的Jar包即可。

&emsp;&emsp;Demo项目是Maven类型的项目，熟悉Java开发的应该很熟悉了，可以用自己喜欢的软件进行开发，比如我就喜欢使用idea进行开发。执行mvn install，就生成好了对应的Jar包，然后通过官方提供的脚本打包成Apk文件，没错，就是Apk文件，不过不是安卓上的Apk，而是华为路由器对应的Apk文件，然后官方还提供了上传应用的工具，直接上传即可。

<img src="https://p5.toutiaoimg.com/img/tos-cn-i-qvj2lq49k0/84782e44e02f455cb85ea01e2e61cc8a~tplv-obj.jpg"/>

插件上传工具

&emsp;&emsp;就这样，一个Hello Word应用就跑到路由器上了。只不过官方提供的Demo项目没有前端，只能在后台控制台上查看对应的输出。如果需要开发前端，需要将对应的前端文件上传到公网服务器上，通过IP进行调用。

**实现路由器上跑Web服务器**

&emsp;&emsp;Demo应用跑通了，接下来准备做些什么了。既然路由器运行着JVM，那么跑Web应用应该是没什么问题的，而且我这个路由器还有512M的内存，低负载的Web应用应该没有问题。这个基础上，我们能够做我们想做的任何事情，比如做个NAS服务器，当内部博客服务器等等，当然如果你有公网条件，也可当小型博客服务器使用，这里只讨论内网应用。JDK1.8本来内置一个简单的HttpServer类，可惜路由器JVM把这个类精简了，于是我编写了以下的类文件。

```
package ml.minli.tool.util;

import javax.activation.MimetypesFileTypeMap;
import java.io.*;
import java.net.*;

public class HttpServer extends Thread {

    private final int port;

    private ServerSocket serverSocket;

    private static final MimetypesFileTypeMap mimetypesFileTypeMap = new MimetypesFileTypeMap();

    public HttpServer(int port) {
        this.port = port;
    }

    @Override
    public void run() {
        try {
            serverSocket = new ServerSocket(port);
            while (true) {
                Socket socket = serverSocket.accept();
                HttpRequestHandler httpRequestHandler = new HttpRequestHandler(socket);
                httpRequestHandler.handle();
                socket.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (serverSocket != null && !serverSocket.isClosed()) {
                try {
                    serverSocket.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private static class HttpRequestHandler {

        private final Socket socket;

        public HttpRequestHandler(Socket socket) {
            this.socket = socket;
        }

        public void handle() {
            try {
                StringBuilder stringBuilder = new StringBuilder();
                InputStreamReader inputStreamReader = new InputStreamReader(socket.getInputStream());
                char[] chars = new char[1024];
                int mark;
                while ((mark = inputStreamReader.read(chars)) != -1) {
                    stringBuilder.append(chars, 0, mark);
                    if (mark < chars.length) {
                        break;
                    }
                }
                if (stringBuilder.length() == 0) {
                    return;
                }
                //截取每行请求
                String[] lines = stringBuilder.toString().split("\r\n");
                if (!lines[0].isEmpty()) {
                    //截取URL
                    String[] infos = lines[0].split(" ");
                    String info = URLDecoder.decode(infos[1], "UTF-8");
                    File file;
                    if (info.equals("/")) {
                        file = new File(USBInfo.usbPath + "/index.html");
                    } else {
                        file = new File(USBInfo.usbPath + info);
                    }
                    //文件不存在返回404
                    if (!file.exists()) {
                        socket.getOutputStream().write(("HTTP/1.1 404 Not Found\r\n" +
                                "Content-Type: text/html; charset=utf-8\r\n" +
                                "\r\n").getBytes());
                        return;
                    }
                    String contentType = mimetypesFileTypeMap.getContentType(file);
                    socket.getOutputStream().write(("HTTP/1.1 200 OK\r\n" +
                            "Content-Type: " + contentType + "; charset=utf-8\r\n" +
                            "\r\n").getBytes());
                    FileInputStream fileInputStream = new FileInputStream(file);
                    byte[] bytes = new byte[1024];
                    int length;
                    while ((length = fileInputStream.read(bytes)) != -1) {
                        socket.getOutputStream().write(bytes, 0, length);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (socket != null && !socket.isClosed()) {
                    try {
                        socket.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

}
```

&emsp;&emsp;由于我只准备先实现静态网页服务器的解析，于是准备这样实现：U盘里面存放前端文件，比如HTML、CSS、JS等，然后服务器解析文件返回，所以这就简单多了。只需要拿到请求进行解析就行了，不过返回需要合适的Content-Type，这个就需要对文件类型进行判断了，于是用到了javax.activation这个包，本来这个包也是JDK1.8自带的，可惜，路由器JVM里面精简了。不过可以通过Maven插件将文件打包进去。

```
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.felix</groupId>
                <artifactId>maven-bundle-plugin</artifactId>
                <version>5.1.2</version>
                <extensions>true</extensions>
                <configuration>
                    <archive>
                        <addMavenDescriptor>false</addMavenDescriptor>
                    </archive>
                    <instructions>
                        <bundleName>{project.name}</bundleName>
                        <bundleDescription>{project.description}</bundleDescription>
                        <bundleVendor>minli</bundleVendor>
                        <Bundle-Activator>ml.minli.tool.Activator</Bundle-Activator>
                        <Service-Component>OSGI-INF/USBInfo.xml</Service-Component>
                        <Embed-Dependency>*;scope=compile|runtime;inline=false</Embed-Dependency>
                    </instructions>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

&emsp;&emsp;最后，在启动的实例类里面调用即可。这里使用22222端口进行测试，值得注意的是，一些端口被路由器本身占用了，所以我们只能使用其它端口。

```
package ml.minli.tool;

import ml.minli.tool.util.HttpServer;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {

    public Activator() {
    }

    @Override
    public void start(BundleContext bundleContext) {
        new HttpServer(22222).start();
    }

    @Override
    public void stop(BundleContext bundleContext) {
    }

}
```

&emsp;&emsp;同时，我们还要注意权限的问题，很多地方，没有权限程序是会抛异常的。权限配置如下所示。

```
(org.osgi.framework.PackagePermission "*" "import")
(java.util.logging.LoggingPermission "control")
(org.osgi.framework.ServicePermission "com.huawei.hilink.rest.RESTResource" "register")
(java.io.FilePermission "/mnt/-" "read")
(com.huawei.hilink.coreapi.perm.USBPermission "*" "list")
(org.osgi.framework.ServicePermission "com.huawei.hilink.openapi.usbstorage.USBStorage" "get")
(java.net.SocketPermission "*" "accept,connect,listen,resolve")
(java.util.PropertyPermission "*" "read")
```

&emsp;&emsp;最终，成功实现了路由器跑Web应用的功能，可以运行任意的网页，同时如果是一些普通的文件，通过URL访问相当于是下载，所以做个简单的NAS服务器好像很容易。

**后续**

&emsp;&emsp;折腾到这样，当时就暂时告一段落了，因为那个时候还在准备考研，到现在考研结束才整理写下了这些内容，不过现在我又可以折腾了，看看有什么应用可以做的，如果有进展，我会继续分享的。
