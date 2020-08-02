Цель: Написать SPA на React
 
SPA должно содержать следующие элементы:
1. Форму логина с валидацией полей(проверка мейла, проверка пароля(не менее 7 символов, содержащих только латинские буквы верхнего и нижнего регистров и цифры, но без спец. символов, кроме "_"). В форме логина показ сообщения об ошибках не должен приводить к ресайзу формы.
2. Вкладку "Курсы валют" с возможностью добавить любую валютную пару/пары в "Избранное". Такая валютная пара/пары должны попасть наверх списка в риал-тайм.
3. Вкладку "Конвертер" с возможностью рассчитать, какое количество одной валюты можно купить за другую в рамках имеющихся валютных пар.
4. Вкладку "История" по заданным ниже критериям.
   На вход попадает 100 сделок. Отобразить в истории нужно 20 с разбиением на десятки.
   В каждой десятке должно быть:
   - не больше 2-х убыточных сделок;
   - сделки отсортированы по дате и времени закрытия(вверху ближайшая сделка к текущей даты и времени, и так далее)
   - хотя бы 1-2 сделки с прибыльностью больше 100 долларов
   - не более двух одинаковых активов
Приложение должно быть респонсивным и иметь максимальную скорость работы(как при загрузке приложения, так и при конвертировании валют).
В конце необходимо написать сколько времени заняло выполнение данного тестового задания.

В приложенном файле TEST SPA app.psd находится дизайн, а в SPA-test.API.pdf описание API, логин/пароль тестового пользователя.
API URL для отправки запросов http://130.211.109.15/api.php
