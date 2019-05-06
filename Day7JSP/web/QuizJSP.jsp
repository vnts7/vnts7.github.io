<%-- 
    Document   : QuizJSP
    Created on : May 6, 2019, 1:29:06 PM
    Author     : 987031
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="java.util.*, mum.cs472.model.*" %>
<% 
    Quiz q = (Quiz)session.getAttribute("quiz");
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP - The Number Quiz</title>
    </head>
    <body>
        <h1>The Number Quiz</h1>
        <p>Your current score: <%= q.getScore()%>.</p>
        <p>Guess the next number in the sequence.</p>
        <p><%= q.next()%></p>
        <form action="quiz" method="post">
            <p>Your answer: <input size="3" name="answer" type="number"/></p>
            <input type="submit"/>
        </form>
    </body>
</html>
