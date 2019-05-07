<%-- 
    Document   : result
    Created on : May 7, 2019, 1:51:23 PM
    Author     : 987031
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="java.util.*" %>
<%@ taglib prefix='a' uri='http://java.sun.com/jsp/jstl/core' %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Beer</title>
    </head>
    <body>
        
        <h1>Beer recommendation JSP!</h1>
        <a:forEach var="s" items="${styles}">
            <p>Try ${s}</p>
        </a:forEach>
    </body>
</html>
