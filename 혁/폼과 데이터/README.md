# 4. 폼과 데이터

## 데이터
데이터는 다양한 소스로부터 나오기 때문에 보안 의식을 가진 개발자라면 데이터를 두 가지로 구분해야 합니다.
 - 필터링된 데이터
 - 오염된 데이터
 ```
 $email = 'chris@example.com';
 ```

chris@example.com는 원격 소스에서 가져온 데이터가 아닙니다. 이 소스는 직접 작성한 신뢰하는 데이터라고 할 수 있습니다. 원격 소스에서 가져오는 모든 것은 입력이며, 모든 입력은 오염된 것으로 봐야하기 때문에 반드시 필터링을 거쳐야 합니다. 스크립트를 통해 아래와 같이 언제든지 변경될 수 있음을 주의해야합니다.
```
$email = $_POST['email'];
```

그래서 데이터를 바꿀 수 없게 하려면 변수 대신 상수를 사용해야 한다.
```
define('EMAIL', 'chris@example.org');
```
스크립트를 통해 값을 변경하려해도 상수는 절대 변경되지 않는다. 이처럼 원격 소스에서 가져온 모든 데이터를 검증하기 전까지는 오염된 것으로 보고 그에 따른 대처를 해야한다.

## 폼
폼 데이터는 GET이나 POST 전송방식(Request method)을 사용해서 전송된다. HTML 폼을 생성할 때 FORM 태그의 METHOD 속성에서 전송방식을 지정할 수 있다.
알다 시피 GET의 경우 폼 내의 데이터들은 URL의 쿼리 스트링으로 전달된다. 반면 POST의 경우 요청의 컨텐츠에 들어간다.
```
POST /api.php HTTP 1.1
HOST: example.org
Content-Type: application/x-www-form-urlencoded           // Default\
Content-Length: 32

username=hyuk&password=myPassword
```