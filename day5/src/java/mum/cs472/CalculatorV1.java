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
public class CalculatorV1 extends HttpServlet {

    

    

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
        response.setContentType("text/html;charset=UTF-8");
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
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Calculator</title>");            
            out.println("</head>");
            out.println("<body>");
            
            if(!a.isEmpty()){
                out.println("<p></p>");
                out.print(a1+" + "+a2+" = "+a);
            }
            if(!m.isEmpty()){
                out.println("<p></p>");
                out.print(m1+" * "+m2+" = "+m);
            }
            out.println("</body>");
            out.println("</html>");
        }
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
