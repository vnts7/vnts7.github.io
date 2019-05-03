/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mum.cs472;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author 987031
 */
public class Calculator extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletResponse response, 
            String a1, String a2, String a, String m1, String m2, String m)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Calculator</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Calculator</h1>");
            out.println("<form method='POST'>");
            out.println("<input type='number' name='a1' value='"+a1+"'/> + <input type='number' name='a2' value='"+a2+"'/> = <input type='number'  value='"+a+"' readonly/>");
            out.println("<p></p>");
            out.println("<input type='number' name='m1' value='"+m1+"'/> * <input type='number' name='m2' value='"+m2+"'/> = <input type='number'  value='"+m+"' readonly/>");
            out.println("<p></p>");
            out.println("<input type='submit'/>");
            out.println("</form>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(response,"","","","","","");
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String a1 = request.getParameter("a1");
        String a2 = request.getParameter("a2");
        String m1 = request.getParameter("m1");
        String m2 = request.getParameter("m2");
        String m="",a="";
        if(!a1.isEmpty() && !a2.isEmpty())
        {
            a= (Integer.parseInt(a1) + Integer.parseInt(a2)) + "";
        }
        if(!m1.isEmpty() && !m2.isEmpty())
        {
            m= (Integer.parseInt(m1) * Integer.parseInt(m2)) + "";
        }
        processRequest( response, a1,a2,a,m1,m2,m);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
