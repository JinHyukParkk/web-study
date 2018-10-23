# 3.2 SQL 삽입 공격
SQL삽입 공격은 PHP 응용프로그램에서 일반적인 취약점입니다. 해당 공격을 위해서는 '입력 데이터 필터링', '이스케이프를 하지 못할 때' 주로 발생합니다. 또한 공격자는 서버의 코드와 데이터베이스의 스키마를 알 수 없기에 경험으로 추측해내야합니다. 
```
<form action="/login.php" method="POST">
    <p>Username: <input type="text" name="username"/></p>
    <p>Password: <input type="password" name="password"/></p>
    <p><input type="submit" value="Log In"></p>
</form>
