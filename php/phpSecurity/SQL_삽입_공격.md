# 3.2 SQL 삽입 공격
SQL삽입 공격은 PHP 응용프로그램에서 일반적인 취약점입니다. 해당 공격을 위해서는 '입력 데이터 필터링', '이스케이프를 하지 못할 때' 주로 발생합니다. 또한 공격자는 서버의 코드와 데이터베이스의 스키마를 알 수 없기에 경험으로 추측해내야합니다. 
```
<form action="/login.php" method="POST">
    <p>Username: <input type="text" name="username"/></p>
    <p>Password: <input type="password" name="password"/></p>
    <p><input type="submit" value="Log In"></p>
</form>
```
위의 폼을 랜더링하면 username과 password를 입력하는 창이 나올 것입니다. HTML 소스를 보았을 때 어떤 식으로 서버 소스가 구성되었을지 추측이 가능합니다.

첫번째로 아래와 같이 서버 소스를 추측할 수 있습니다.
```
<?php
    $password_hash = md5($_POST['password']);
    $sql = "SELECT count(*) FROM user_tbl WHERE username = '{$_POST['username']}' AND '$password_hash'";
>
```
하지만 현재는 MD5의 취약점이 발견되어 주로 사용하는 암호화 방식은 아닙니다.

그래서 두번째 방법으로는 작은따옴표 (')을 입력해 보는 것입니다.
```
<?php
    mysql_query($sql) or exit(mysql_error());
>
```
만약 위의 소스처럼 에러 처리가 제대로 되어있지 않는 상태라면 
```
$sql = "SELECT * FROM users WHERE username = ''' AND password = 'asdvi3141fsvxcovx';
```
해당 쿼리를 보내게 되면 syntax 에러와 동시에 사용되는 쿼리를 오류로 표시받을 수 있습니다. 이를 통해 공격자는 필터링, 이스케이프가 제대로 안되어있는 것과 WHERE 절도 알아내었습니다.

이 시점에서는 자유롭게 공격이 가능합니다. '--' 와 같은 SQL 주석을 사용하여 성공적인 엑세스 인증을 할 수 있습니다.
```
<?
    $sql = "SELECT * FROM user_tbl WHERE user_name = 'myuser' or 'you' = 'you' -- AND password = 'asdvi3141fsvxcovx'    
>
```
위의 쿼리가 실행이 되는 "or 'you' = 'you'" 는 항상 참이므로 쉽게 접근할 수 있습니다. 또한 username을 알고 있다면 특정 대상으로 할 수 있습니다. 

이처럼 공격 방법을 알아보았습니다. 해당 공격 방법을 막기 위해서는 항상 데이터 필터링과 이스케이프 하는 습관을 잊으면 안됩니다. 
현재 php에서 이스케이프를 위한 함수 mysql_escape_string()이 있으며 만약 이 함수를 제공하지 않는다면 최후의 수단으로 addSlashes()를 사용하면 됩니다.
