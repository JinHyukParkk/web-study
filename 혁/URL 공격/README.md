#5. URL 공격

## 5.1. URL 변경
 http://example.org/private.php?user=chris의 링크를 클릭해서 user에 해당하는 값을 변경했을 때 공격자들은 chris 대신 다른 user를 넣어 접근할 수 있는지 알아볼 것입니다. POST 데이터와 GET 데이터를 처리하는 데에 큰 차이는 없지만 GET 전송방식이 보다 많은 데이터를 노출하기 때문에 공격 대상이 자주 됩니다.
  
 예시로 사용자가 로그인하는 응용프로그램을 생각해 볼 때 비밀번호를 기억하는 방법이 필요합니다. 가장 일반적인 방법은 비밀번호를 추측하려는 공격자가 쉽게 알 수 없는 질문을 사용자에게 묻는 방법입니다.(어머니 생년월일 등) 이 후 계정에 등록된 이메일 주소로 새로운 비밀번호를 보내는 것입니다. 하지만 이메일 주소가 없는 경우 사용자에게 이메일 주소를 물어 볼 수도 있습니다.(정보 수집) 
 ```
 <form action="reset.php" method="GET>
    <input type="hidden" name="user" value="chris" />
    <p>새로운 비밀번호를 받을 이메일 주소를 입력하세요:</p>
    <input type="text" name="email" /></br>
    <input type="submit" value="Send Password" />
</form>
 ```

 요청을 전달받는 reset.php는 비밀번호를 초기화하기 위한 계정 이름, 새로운 비밀번호를 전송할 이메일 주소와 같이 처리에 필요한 모든 정보를 전달받습니다. 사용자 검증 질문을 통과 후 폼을 제출합니다.
 ```
http://example.org/reset.php?user=chris&email=chris%40example.org
 ```
 브라우저 주소창에 위와 같은 URL이 나타나기 때문에 이 과정을 경험한 사용자는 user와 email 변수의 용도를 쉽게 알아낼 것이고, 사용자는 시험삼아 user를 바꾸어 사용할 수 있습니다.
 ```
 http://example.org/reset.php?user=php&email=chris%40example.org
 ```
 reset.php는 사용자 검증 후 폼이 제출되어 실행되기 때문에 URL 공격에 취약합니다. 이와 같은 경우 php의 계정을 손쉽게 훔쳐낼 수 있습니다. 이를 위해 세션을 사용한다면 문제는 쉽게 해결됩니다.
 ```
 <?php
    session_start();

    $clean = array();
    $email_pattern = '/^[^@\s<&>]+@([-a-z0-9]+\.)+[a-z]{2,}$/i';
    if (preg_match($email_pattern, $_POST['email'])) {
        $clean['email'] = $_POST['email'];
        $user = $_SESSION['user'];
        $new_password = md5(uniqid(rand(), TRUE));

        if ($_SESSION['verified']) {
            /* 비밀번호를 업데이트 */
            mail($clean['email'], 'Your New Password', $new_password);
        }
    }
 ?>
 ```
위와 같은 코드는 사용자가 입력하는 이메일 주소를 신뢰해서는 안된다는 것을 보여줍니다. 사용자가 사용자 확인 질문을 올바르게 대답했는지 여부를 $_SESSION['verified']와 같은 세션 변수를 통해 관리하고 있습니다. 사용자 확인 질문에 대답했던 계정 이름을 $_SESSION['user'] 세션 변수로 관리하고 있습니다. 말해서 입력을 신뢰하지 않는 것이 응용프로그램의 보안 구멍을 예방하는 핵심인 것입니다.
