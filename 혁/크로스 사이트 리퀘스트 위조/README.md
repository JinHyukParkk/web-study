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
        echo '<p>Success</p>';
    } else {
        echo '<p>Fail</p>';
    }
}
```
위의 form을 보면 입력 폼들의 데이터를 buy.php로 요청합니다. 이를 통해 폼 요소와 요청되는 URL을 알아내어 GET 데이터를 사용할 수 있는지 시도할 수 있습니다.
```
http://store.example.org/buy.php?item=pen&quantity=1
```
이러한 방식으로 URL의 형식을 알아내면 공격자는 URL 방문자만 알면 쉽게 CSRF 공격을 할 수 있습니다. CSRF 공격을 실행할 수 있는 방법은 여러가지가 있습니다. 그 중 이미지와 같이 페이지 내에 포함된 요소들을 사용하는 것이 가장 일반적인 방법입니다. 
예시로 http://www.google.com 메인 페이지를 방문했을 때 브라우저는 먼저 URL로 식별할 수 있는 부모 요소에 대한 요청을 전송합니다. 그리고 응답으로 전송되는 컨텐츠는 페이지에서 소스보기로 볼 수 있는 HTML이 됩니다. 브라우저는 이 HTML 소스를 분석한 다음에 구글 로고 이미지를 발견합니다. 이 이미지는 HTML img 태그로 알 수 있고, 이미지의 URL은 src 속성에서 알 수 있습니다. 브라우저는 이 이미지에 대한 추가 요청을 전송합니다. 그래서 이미지를 불러오는데에 두 번의 요청이 있고, 차이점은 URL 밖에 없습니다.
CSRF는 브라우저의 이러한 동작을 이용하기 위해 img 태그를 사용합니다. HTML 소스에 다음 이미지를 가진 웹 사이트를 방문한다고 가정해보면
```
<img src="http://store.example.org/buy.php?item=pencil&quantity=50" />
```
위의 buy.php는 $_POST 대신에 $_REQUEST를 사용하기 때문에 store.example.php에 로그인한 모든 사용자는 이 URL을 요청할 때마다 pencil을 50개 구입하게 됩니다.
** 그래서 CSRF 공격은 방지하기 위해 $_REQUEST를 사용하는 것은 권장되지 않습니다.


## 해결 방법
 CSRF 공격의 위험을 줄이기 위해 몇 가지 방법이 있습니다. 
 첫번째로 HTML 폼에서는 GET 대신에 POST를 사용하고 폼 처리 로직에서는 $_REQUEST 대신 $_POST를 사용합니다.
 두번째로 중요한 처리에 대해서는 사용자가 요청한 것이 맞는지 확인을 요청합니다. 아래의 코드를 보면
 ```
 <?php
    session_start();
    $token = md5(uniqid(rand(), TRUE));
    $_SESSION['token'] = $token;
    $_SESSION['token_time'] = time();
 ?>

<form action="buy.php" method="POST>
    <input type="hidden" name="token" value="<?php echo $token; ?>" />
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
 ```
 위의 form을 보면 처음 form 과는 다르게 token에 관련의 input 태그가 포함된 것을 볼 수 있다. 토큰은 사용자의 세션에 저장되기 때문에 공격자는 공격하기 위해서 사용자의 유일한 토큰을 사용해야 합니다. 그래서 다른 사용자의 요청을 위조하는데 자신의 토큰을 사용할 수 없습니다. 토큰은 간단한 조건문으로 검사할 수 있습니다.
 ```
 <?php
    if (isset($_SESSION['token']) && $_POST['token'] == $_SESSION['token']) {
        /* 유효한 토큰 */
    }
 ?>
 ```
 토큰의 유효 기간 5분과 같이 매우 짧은 시간으로 제한할 수 있습니다.
 ```
<?php
    $token_age = time() - $_SESSION['token_time'];
    if ($token_age <= 300> ) {
        /* 5분 지나지 않았으면 수행 */
    }
?>
 ```

폼에 토큰을 추가한 것으로 CSRF 공격의 위험을 효과적으로 제거할 수 있습니다.
** 추가적으로 위의 내용과 같이 익스플로잇은 img 태그를 사용했지만 공격자가 다른 사용자로부터 HTTP 요청을 위조하는 종류의 공격을 통틀어서 CSRF 라고 합니다. GET과 POST 모두 알려진 익스플로잇이 있지만 그렇다고 POST만 사용해서는 안됩니다.
