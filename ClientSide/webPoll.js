var ws;

var SelectedAnswer="null";
var textPoll = '{"PollInfoList":[ {"QuestionText":"Objection Model","QuestionIndex":0, "IsMultiple": true,"AnwserText":["Acknowledge","Ask a Question","Address Objection"]},{"QuestionText":"Wooo question 2 here we are","QuestionIndex":1,"IsMultiple": false,"AnwserText":["super test is here","another test comming right up","asdasdasd"]}]}'
var questiontext="Do you think nicole should get the job?";
var answerstext=["yes! Hire her!", "Yes, I think she'd go well.", "I'm not sure.", "probably not.", "No! She needs to practice much more."]
var answerhtml= $("#template-answer").html();
var questionhtml= $("#template-question").html();
var Testresults = {
  clientCount: 2,
  hide: true,
 questions : [{answers: [1,0,1]},{answers: [1,0,1]}  ]
  
}


$(document).ready(function(){
  $(".btn").hide();

 // $(".question").hide();
 
 var poll =  JSON.parse(textPoll);

//setPoll(poll.PollInfoList);
  ConnectSocket();
  //setResults(Testresults)
  ActionHide();
});

function ActionShow(){
  $(".action-Info").show();
  $(".action-Rep").show();
  $(".qualitative-selector").show();
}
function ActionHide(){
  $(".action-Info").hide();
  $(".action-Rep").hide();
  $(".qualitative-selector").hide();

}
function ConnectSocket(){
  var link = "wss://" +  "instage-test.com:8080";// "0a093883.ngrok.io";
							 ws = new WebSocket(link);
               ws.onopen = function() 
               {
            
                  alert("connected");
               };
				
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                 var outputBox = document.getElementById("output");
                 console.log(received_msg)
                 try
                 {
            				var ChatMessage =  JSON.parse(received_msg);
            				if(ChatMessage.PollInfoList != undefined)
                    { 
                      ClearAnswers();
                     // var poll =  JSON.parse(textPoll);

                      setPoll(ChatMessage.PollInfoList);
                     // setResults()

                      // SetQuestion(ChatMessage.QuestionText);
                      //$(".btn").show();
                      $(".question").show();
                    }

                    if(ChatMessage.clientCount != undefined){

                      if(ChatMessage.hide == false){
                        setResults(ChatMessage);

                      }else{
                        ResultsHide();
                      }
                    }

                    if(ChatMessage.AnwserText != undefined){
                      SetAnswerText(ChatMessage.AnwserText);
                      
                    }
                    
                  
        				}
        				catch
                {

        				}
               
                  //alert("Message is received..."+ received_msg);
               };
				
               ws.onclose = function() 
               { 
                  
                  // websocket is closed.
                  alert("Connection is closed..."); 
                  ConnectSocket()

               };
           
}
function SendMessage(message)
{
  if(ws != undefined)
  {
    ws.send(message);
  }
}
function setPoll(poll){

  console.log("yo");

  
  for(var i = 0; i <  poll.length; i++)
  {
    SetQuestion(poll[i].QuestionText);
    SetAnswerText(poll[i])
  }
  ResultsHide();
 
  
}
function ResultsHide(){
  $(".resultBarBackground").css("background-color","white");
  $(".resultBar").css("background-color","white");
  $(".resultText").hide();
}

function resultsShow(){
  $(".resultBarBackground").css("background-color","lightgray");
  $(".resultBar").css("background-color","#41c1ca");
  $(".resultText").show();
}
function setResults(results){
  resultsShow();

  var rawResultArray = [];
  for(var i = 0; i <  results.questions.length; i++)
  {
    for(var j = 0; j <  results.questions[i].answers.length; j++)
    {
      rawResultArray.push(results.questions[i].answers[j]);
    }

  }
  $(".resultText").each(function( index ) 
  {
   var percent = Math.trunc(  (rawResultArray[index] / results.clientCount) *100);
    var text = "(" + rawResultArray[index] +")<br>" +percent  +  "%"
    $( this ).html(text)  
  });
  
  $(".resultBar").each(function( index ) 
  {
    var percent = Math.trunc(  (rawResultArray[index] / results.clientCount) *100);


    $( this ).css("width", percent+"%");
  }
  );


}
function SetQuestion(qtext){
  
  
    $(".answers").append(questionhtml);
    
    $(".question").last().html(qtext);

}

function SetAnswerText(answers)
{
  
  //answers.AnwserText
  $(".answers").show();

 for(var i = 0;  i < answers.AnwserText.length; i++)
 {
 	  var _answer= answers.AnwserText[i];
    $(".answers").append(answerhtml);   

   

    $(".answertext").last().text(_answer);
    $(".answerContainer").last().find("input").val(i);;
    $(".answerContainer").last().find("input").attr("data-questionIndex", answers.QuestionIndex)
    $(".answerContainer").last().find("input").attr("name", answers.QuestionText)
    if(answers.IsMultiple){

      $(".answerContainer").last().find("input").attr("type", "checkbox")
    }
    else{  
     $(".checkmark").last().css("border-radius", "30px")
     

    }
  //  $(".checkmark").last().hide();

 }
} 


function SendAnswer(radio){
  $(".output").html( $("input[type='radio'][name='radio']:checked").val());
  var answerObject = {};
  answerObject.questiontext =radio.name;   //$(".question").text();
  answerObject.answerIndex = radio.value; // $("input[type='radio'][name='radio']:checked").val();
  answerObject.questionIndex = radio.getAttribute("data-questionIndex");

  console.log(JSON.stringify(answerObject));
  //console.log(radio.questionIndex);
  SendMessage(JSON.stringify(answerObject));
}

function ClearAnswers()
{
  $(".btn").hide();
  $(".question").hide();
  $(".answers").hide();
  $(".answers").html("");
	//$(".answertext" ).each(function(i,o ) {
  //o.style.display='none';
//});
}


function ButtonDemo()
{
    ClearAnswers();
    //SetQuestion(questiontext);
    //SetAnswerText(answerstext);
//<link rel="stylesheet" type="text/css" href="mystyle.css">

}
