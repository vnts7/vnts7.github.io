/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mum.cs472.model;

/**
 *
 * @author 987031
 */
public class Quiz {
    private static String[] questions={
        "3,1,4,1,5",
        "1,1,2,3,5",
        "1,4,9,16,25",
        "2,3,5,7,11",
        "1,2,4,8,16"
    };
    private static Integer[] answers={9,8,36,13,32};
    private int current=-1;
    private int score=0;
    public Boolean hasNext(){
        return current<questions.length-1;
    }
    public String next(){
        if(hasNext()){
            current++;
            return questions[current];
        }
        return null;
    }
    public void submitAnswer(Integer answer){
        if(answer.equals(answers[current])) score++;
    }
    public int getScore(){
        return score;
    }
    public int getNumQuestion()
    {
        return questions.length;
    }
}
