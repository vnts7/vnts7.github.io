/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mum.cs472;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.*;

/**
 *
 * @author 987031
 */
public class DbConnection {

    public static String Search(String key) {
        key = key.toLowerCase();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        JSONArray ar = new JSONArray();
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn
                    = DriverManager.getConnection("jdbc:mysql://localhost:3306/entries?"
                            + "user=root&password=root");
            stmt = conn.prepareStatement("SELECT * FROM entries WHERE LOWER(word)=?");
            stmt.setString(1, key);
            rs = stmt.executeQuery();
            while (rs.next()) {
                JSONObject o = new JSONObject();
                o.put("word", rs.getString("word"));
                o.put("wordtype", rs.getString("wordtype"));
                o.put("definition", rs.getString("definition"));
                ar.put(o);
            }
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            // it is a good idea to release
            // resources in a finally{} block
            // in reverse-order of their creation
            // if they are no-longer needed

            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException sqlEx) {
                } // ignore

                rs = null;
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException sqlEx) {
                } // ignore

                stmt = null;
            }
        }
        return ar.toString();
    }
}
