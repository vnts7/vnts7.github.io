<%-- 
    Document   : Finish
    Created on : May 6, 2019, 2:25:08 PM
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
        <p>You have completed the Number Quiz, with score <%=q.getScore()%> out of <%=q.getNumQuestion()%></p>
    </body>
</html>
