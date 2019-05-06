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
import javax.servlet.http.HttpSession;
import mum.cs472.model.Quiz;

/**
 *
 * @author 987031
 */
public class QuizServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession s = request.getSession();
        Object quizO = s.getAttribute("quiz");
        if (quizO == null) {
            quizO = new Quiz();
        }
        Quiz q = (Quiz) quizO;
        if(request.getMethod().equals("POST")){
            String answer = request.getParameter("answer");
            if(!answer.isEmpty()){
                q.submitAnswer(Integer.parseInt(answer));
            }
        }
        else{
            q = new Quiz();
        }
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>QuizServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>The Number Quiz</h1>");
            out.println("<p>Your current score: "+q.getScore()+".</p>");
            if (q.hasNext()) {
                
                out.println("<p>Guess the next number in the sequence.</p>");
                out.println("<p>"+q.next()+"</p>");
                out.println("<form action='quiz' method='post'>");
                out.println("<p>Your answer: <input size='3' type='number' name='answer'/></p>");
                out.println("<input type='submit'/>");
                out.println("</form>");
            }
            else{
                out.println("<p>You have completed the Number Quiz, with score "+q.getScore()+" out of "+q.getNumQuestion()+"</p>");
            }
            out.println("</body>");
            out.println("</html>");
        }
        s.setAttribute("quiz", q);
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
        processRequest(request, response);
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
        processRequest(request, response);
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
