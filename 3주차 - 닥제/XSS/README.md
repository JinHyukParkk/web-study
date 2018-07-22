# 1. XSS(사이트 간 스크립트)
XSS란 웹페이지에 악성 스크립트를 삽입 하여 해당 웹사이트 취약점을 이용해 공격하는 웹 공격 기법중 하나이다. 즉 기존 웹사이트에 악성 웹 양식 혹은 웹 URL을 삽입해 기존 의도와 다르게 실행하여 취약점을 발견해 공격합니다. 공격 받았을 때에 세션 하이재킹, 악의적인 페이지로 리다이렉팅, CSRF 공격 등으로 악용할수 있다. 흔히 XSS는 자바스크립트를 통해 공격하는 방식을 대개 말한다.(SQL Injection에 연관이 있을 수 있으나 기본적으로 자바스크립트 공격에 XSS이라고 부름)

# 2 XSS 공격 유형
XSS는 기본적으로 Reflect와 persistent 두가지로 나뉜다.

## 2.1 Reflect
Reflect는 일시적으로 취약점이 발생한 것을 통해 반응한다. 예를 들어 URL을 통해 파라미터 값을 전달하여 결과값을 브라우저로 출력하는것이 있다. GET Method를 통해 스크립트가 전달되기때문에 일시적인 취약점이 있다고 할 수 있다.

## 2.2 Persistent
지속형 취약점으로 DB에 악의성 있는 스크립트를 삽입 하여 DB에서 특정 글을 호출 할 때 스크립트를 계속해서 호출하게 하여 공격한다. 

# 3 방어방법
기본적으로 php에서는 htmlspecialchars가 있다.
```
<div><?php echo htmlspecialchars($name); ?>님의 말: </div>
```
htmlspecialchars는 특수문자를 html 앤터티로 변환하여 스크립트 등을 html 앤터티로 변환 시켜 일반 text로 출력하게 한다.

이렇게 할 경우에는 기본적인 문법을 지킨 스크립트 공격은 대부분 막게 된다.

하지만 이렇게 될 경우 특정 html 태그를 사용하지 못해, ui부분을 꾸밀 수 없기 때문에 몇몇 태그는 허용해주는 방법이 있다.

```
function html_filter($content)
{
 // Strip bad elements.
 $content = preg_replace('/(<)(|\/)(\!|\?|html|head|title|meta|body|style|link|base|script'.
 '|frameset|frame|noframes|iframe|applet|embed|object|param|noscript|noembed|map|area|basefont|xmp|plaintext|comment)/i',
 '&lt;$2$3', $content);

 // Strip script handlers.
 $content = preg_replace_callback("/([^a-z])(o)(n)/i",
 create_function('$matches', 'if($matches[2]=="o") $matches[2] = "&#111;";
 else $matches[2] = "&#79;"; return $matches[1].$matches[2].$matches[3];'), $content);

 return $content;
}
```
출저 wiki피디아(https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85)

해당 코드는 php로 구현한 간단한 html 필터 코드이다.

위 strip bad elements에 해당하는 코드는 해당 태그들을 삽입 못하도록 막은 것이다. 정규식을 이용해 태그 필터링을 해서 
다른 태그들은 사용할 수 있게끔 하였다.

# 4. 마치며
사실 xss를 막더라도 해커는 기여코 xss방법으로 우회하여 웹사이트 취약점을 발견해낸다. 하지만 이러한 기본적인 부분도 방어하지 않는다면, 더 많은 공격시도가 발생할 수 있기 때문에 최소한 안전장치를 다는 것이 좋다고 생각한다.
