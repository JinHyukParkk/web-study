# on('click') VS click
 Javascript에서 click 이벤트를 구현하기 위해 DOM 뒤에 on('click')과 click 을 사용할 수 있습니다. 
 둘 중에 더 선호하는 것은 on('click') 입니다.
 이유는 메모리를 덜먹고, 동적으로 생성되는 요소들이 잘 작동하기 때문입니다.
 
 ```
<html>
    <button id="add">Add new</button>
    <div id="container">
        <button class="alert">alert!</button>
    </div>
    <scirpt>
        $("button#add").click(function() { var html = "<button class='alert'>Alert!</button>"; $("button.alert:last").parent().append(html); });
    </scirpt>
</html>

 ```

위에 코드에서 class에 "alert"을 가진 button 태그를 클릭 했을 때 alert창을 띄우려고 하는데요

이 때 click을 사용했을 때 
```
$('button.alert').click(function() {
    alert(1);
});
```
해당 경우에 많은 요소들은 많은 개별 핸들러를 필요로 해서 메모리 사용량이 증가되고 동적으로 추가된 요소들은 기존 핸들러들이 안먹힙니다. 그래서 html을 새롭게 rebind 해주지 않은 이상 위 add를 구현한 스크립트로 alert버튼을 추가해도 해당 버튼은 동작 되지 않습니다.

on('click')을 사용할 때
```
$("div#container").on('click', 'button.alert', function() {
     alert(1); 
});
```
하나의 핸들러가 동적으로 새롭게 만들어지는 요소를 포함해서, 대응되는 모든 요소를 다루고 있습니다.

또 다른 예로 on('click')을 사용하는 이유는 네임스페이스 때문인데요. 
만약 .on("click", handler) 로 추가하면 .off("click", handler) 로 보통 없앨 수 있어서 참조할 함수가 있다면 확실히 작동한다.
하지만 참조할 함수가 없다면 네임스페이스를 사용해야합니다.

```
$("#element").on("click.someNamespace", function() { console.log("anonymous!"); });
$("#element").off("click.someNamespace");
```