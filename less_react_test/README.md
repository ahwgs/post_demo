
### 关于
- 今天被人问了一个关于`react`中的样式问题，一瞬间脑袋没反应上来好像还回答错了，有点尴尬水一篇文章记录一下。
- 问题描述：在一个`react`父子组件`demo`中，实际效果与书写的样式不太一样。


### 问题复现
直接上代码描述问题:
1. `Parent.js`
```javascript
import React from 'react';
import Child from './Child'
import './Parent.less'

function Parent() {
  return (
    <div className="parent">
        <Child/>
        <div className='component'>parent</div>
    </div>
  );
}
export default Parent;
```
2. `Parent.less`
```less
.parent{
  background-color: blue;
  .component{
    color: white;
  }
}
```
3. Child.js
```javascript
import React from 'react';
import './Child.less'

function Child() {
    return (
        <div className="child">
            <div className='component'>Child</div>
        </div>
    );
}

export default Child
```

4. `Child.less`
```less
.child{
  background-color: red;
  .component{
    color: black;
  }
}
```

大概看一下代码，是有一个`Parent`的父组件，**蓝底白字**。还有一个`Child`的子组件，**红底黑字**。
那么实际渲染出的样式是什么样子的呢。如下图:
![](https://static.ahwgs.cn/blog-img/20190903230341.png)

实际看到的效果确实**蓝底白字**与**红底白字**，为什么与写的代码有出入呢。

### 究其原因
- 为什么子组件的字体颜色不是黑色确是白色?
![](https://static.ahwgs.cn/blog-img/20190903230935.png)

打开调试工具，看到子组件被渲染成一个`<div class="component">Child</div>` 但是样式却被父组件的样式给覆盖变成了白色，

原因：这是因为在w3c 规范中，CSS 始终是「全局的」。在传统的 web 开发中，最为头痛的莫过于处理 CSS 问题。因为全局性，明明定义了样式，但就是不生效，原因可能是被其他样式定义所强制覆盖。

- 为什么同样`.parent .component` 和`.child .component`是父级覆盖子级?

![](https://static.ahwgs.cn/blog-img/20190903231550.png)

这就要涉及到**浏览器渲染原理**与**css的浏览器解析原则则**了

### 浏览器渲染
1. 浏览器将获取的HTML文档解析成DOM树。
2. 处理CSS标记，构成层叠样式表模型`CSSOM(CSS Object Model)`。
3. 将`DOM`和`CSSOM`合并为渲染树`(rendering tree)`将会被创建，代表一系列将被渲染的对象。
4. 渲染树的每个元素包含的内容都是计算过的，它被称之为`布局layout`。浏览器使用一种流式处理的方法，只需要一次绘制操作就可以布局所有的元素。
5. 将渲染树的各个节点绘制到屏幕上，这一步被称为绘制`painting`。

![](https://static.ahwgs.cn/blog-img/20190903232555.png)

需要注意的是，以上五个步骤并不一定一次性顺序完成，比如DOM或CSSOM被修改时，亦或是哪个过程会重复执行，这样才能计算出哪些像素需要在屏幕上进行重新渲染。而在实际情况中，JavaScript和CSS的某些操作往往会多次修改DOM或者CSSOM。

### css的浏览器解析原则
看一个例子:
```css
.nav h3 span {font-size: 16px;}
```
在我们不知道规则的情况下，我们是这样猜测的，按照常人的思维从左到右。先是找到`.nav`,然后向下匹配所有的`h3`和`span`标签。如果在向下匹配的过程中，没有匹配上的则回溯到上一级继续匹配其他子叶结点。

但实际上，CSS选择器读取顺序是**从右到左**

如果是这样的规定的话，还是上面的例子就变成了，先找到所有的`span`标签，然后找`span`标签是`h3`的，然后再延着`h3`往上寻找，这时候发现一个选择器的类名为`.nav`就把这个节点加入结果集；如果一直往上找直到`html`标签都没找到的话，就放弃这条线，换到另一个`span`进行寻找。

那么来看我们的这个`Demo`中的结构
```html
<div class="parent">
    <div class="child">
        <div class="component">Child</div>
    </div>
    <div class="component">parent</div>
</div>
```
浏览器先找到`.component`往上寻找，发现了`.child .component` 这时候渲染出样式为黑色，然后接着向上寻找发现了`.parent .component`发现存在这个CSS规则，所以这时候颜色变成了白色

### 如何变成正确的颜色
- 问题找到了，是因为样式覆盖了，那么如何解决这个问题了。这里我们采用了`CSS Modules`方案。
- 什么是`CSS Modules`?
把`CSS`划分模块，自动为类名后面生成一个hash值保证类名全局唯一。

- `CSS Modules`的使用

1. 使用`create-react-app`创建项目，修改`webpack.config.js`

![](https://static.ahwgs.cn/blog-img/20190904001717.png)


2. 在组件中使用
```html
// parent.js
import styles from './Parent.less'

<div className={styles.parent}>
   <Child/>
   <div className={styles.component}>
    css modules parent
   </div>
</div>  

//child.js
import styles from './Child.less'
<div className={styles.child}>
    <div className={styles.component}>
        css modules child
     </div>
</div>
```
配置完成之后发现样式类名变成了hash值，这样即保证了类名的唯一不会存在覆盖的问题

![](https://static.ahwgs.cn/blog-img/20190904001754.png)


### 关于
- 文章首发于：[为什么我的样式不起作用？](https://www.ahwgs.cn/css-no-effect.html)
- 参考：[浏览器渲染原理与过程](https://www.jianshu.com/p/e6252dc9be32)
- 参考：[CSS选择器从右向左的匹配规则](https://www.cnblogs.com/zhaodongyu/p/3341080.html)
- [DEMO地址](https://github.com/ahwgs/demo)