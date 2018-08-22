# 8. 크로스 사이트 리퀘스트 위조
 크로스 사이트 리퀘스트 위조(CSRF, Cross-Site Request Forgery)는 임의의 HTTP 요청을 전송할 수 있게 하는 공격입니다. 공격자는 다른 사람으로 위조하여 공격을 하기 때문에 또 다른 피해자가 생길 수 있습니다.

예시) 펜이나 연필 중에 하나를 구매할 수 있는 응용프로그램
```
## 입력 form 
<form action="buy.php" method="POST>
    <p>
        Item:
        <select name="item">
            <option name="pen">pen</option>
            <option name="pencil">pencil</option>
        </select><br />
        Quantity: 
        <input type="text" name="quantity" /><br />
        <input type="submit" value="Buy" />
    </p>
</form>

## buy.php
ssesion_start();
$clean = array();
if (isset($_REQUEST['item'] && isset($_REQUEST['quantity'])) {
    // 필터링 생략...
    if (buy_item($clean['item'], $clean['quantity'])) {
        
    }
}
```
이를 통해 폼요소와 요청되는 URL을 알 수 있다.


