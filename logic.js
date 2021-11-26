MAINAPP =(function(){

    const url ="https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json"
   
    const pizzasSpace = document.querySelector("#pizzaSpace");
    const chartSpace = document.querySelector("#chartSpace");
    const price_sum = document.querySelector("#price_sum");
    const empty_chart_text = document.querySelector("#empty_chart_text");
    
    price_sum.style.display="none";

    const chart =[];

    const data = JSON.parse(GetData(url));
    CreateMenu();


    function GetData(url){
        var request = new XMLHttpRequest();
        request.open('GET',url,false);
        request.send(null);
        if(request.status == 200){
                console.log('pobrano dane');
                return request.response;
        }
        else{
            console.log('brak połączenia z serwerem');
        } 
     }

    function CreateMenu(){

        var numOfpizzas = data.length;
        for(var i=0;i<numOfpizzas;i++){
           
            var pizza = MakePizza(i);
            pizzasSpace.appendChild(pizza);
        }
    }


    function MakePizza(id){

        var pizza = document.createElement("div");
        pizza.id =data[id]["id"];
        pizza.classList.add("pizza");

        var pizzaImg = document.createElement("div");
        pizzaImg.classList.add("pizza_img");
        
        
        var img = document.createElement("img");
        img.src = data[id]["image"];
        img.alt = "pizza_img:" + data[id]["id"];
        img.classList.add("img_fit");

        pizzaImg.appendChild(img);
        pizza.appendChild(pizzaImg);


        var pizzaInfo =  document.createElement("div");
        pizzaInfo.classList.add("pizza_info");
        
        var pizza_title = document.createElement("div");
        pizza_title.classList.add("pizza_title");
        pizza_title.innerHTML = data[id]["title"];
        pizzaInfo.appendChild(pizza_title);

        var pizza_ingredients = document.createElement("div");

        var pizza_ingredients_array  = data[id]["ingredients"];


        var ing="";
        pizza_ingredients_array.forEach(element => {

            if(ing === ""){
                ing =element;
            }
            else{
             ing =ing + ", " +element;
            }
        });
        ing=ing.replace("/\n/"," ");

        ing="Składniki:  " + ing;

        pizza_ingredients.innerHTML=  ing;
        pizza_ingredients.classList.add("pizza_ingredients");
        pizzaInfo.appendChild(pizza_ingredients);

        var pizza_price = document.createElement("div");
        pizza_price.classList.add("pizza_price");
        pizza_price.innerHTML="Cena: " + Number(data[id]["price"]).toFixed(2) + " zł";
        pizzaInfo.appendChild(pizza_price);

        pizza.appendChild(pizzaInfo);

        var buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "zamów";
        buttonAdd.addEventListener("click", AddToChart);
        pizza.appendChild(buttonAdd);
    
        return pizza;
    }


    function AddToChart(event){

        if(CalculateAmount()>49){
            alert("W przypadku zamówień powyżej 50 sztuk prosimy o kontakt telefoniczny");
        
        }
        else{

            var currentID = event.target.parentNode.id;

            if (chart.find(e => e.id == currentID)) {
                chart.find(e => e.id == currentID).amount +=1;
            }
            else{
                chart.push({id: data[currentID-1]["id"], amount:1 });
            }

            RefreshChart();
        }
    }

    function RemoveFromChart(event){
        var currentID = event.target.pizzaID;

        var current = chart.find(e => e.id == currentID);

        if(current.amount>1){
            current.amount-=1;
        }
        else{
           var index = chart.indexOf(current);
            if (index > -1) {
                chart.splice(index, 1);
            }

        }
        RefreshChart();

    }

    function RefreshChart(){

        price_sum_count = 0;


        while (chartSpace.childNodes.length>2) {
            chartSpace.removeChild(chartSpace.lastChild);
        }
    
        if(chart.length > 0){
            empty_chart_text.style.display="none";
            price_sum.style.display="block";
        }else{
            empty_chart_text.style.display="block";
            price_sum.style.display="none";
        }

        chart.forEach(element => {
        
            price_sum_count += element.amount * Number(data[element.id-1]["price"]);

            var item = document.createElement("div");
            item.classList.add("chart_item");
            item.id=element.id;

            var upper_chart_item = document.createElement("div");
            upper_chart_item.classList.add("chart_item_section");

            var name = document.createElement("p");
            name.classList.add("chart_item_name")
            name.innerHTML = data[element.id-1]["title"];
            upper_chart_item.appendChild(name);
            
            var price = document.createElement("p");
            price.innerHTML = Number(data[element.id-1]["price"]).toFixed(2) + " zł";
            upper_chart_item.appendChild(price);

            item.appendChild(upper_chart_item);


            var lower_chart_item = document.createElement("div");
            lower_chart_item.classList.add("chart_item_section");

            var amount = document.createElement("div");
            amount.innerHTML ="Ilość: " + element.amount;
            
            lower_chart_item.appendChild(amount);
           

            var buttonDelete = document.createElement("button");
            buttonDelete.innerHTML="usuń";
            buttonDelete.pizzaID = data[element.id-1]["id"];
            buttonDelete.addEventListener("click",RemoveFromChart);
            lower_chart_item.appendChild(buttonDelete);

            item.appendChild(lower_chart_item);

            chartSpace.appendChild(item);

        });

        price_sum.innerHTML = "Suma: "+ price_sum_count.toFixed(2) + " zł";
    }

    function CalculateAmount(){
        var value =0;

        chart.forEach(element =>{
            value +=element.amount;
        });
        return value;
    }    
 
})();
