MAINAPP =(function(){

    const url ="https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json"
   
    const pizzasSpace = document.querySelector("#pizzaSpace");
    const chartSpace = document.querySelector("#chartSpace");
    const priceSum = document.querySelector("#priceSum");
    const emptyChartText = document.querySelector("#emptyChartText");
    
    priceSum.classList.add("hidden");

    const chart = [];

    let pizzaData;

    initiateData(url);


    async function getData(url) {
            const response = await fetch(url)
            .then(obj => obj.json());
            return response;
    }

    async function initiateData(url){
    
        pizzaData  = await getData(url); 
        createMenu();
    }


    function createMenu(){

        let numOfpizzas = pizzaData.length;
        for(let i = 0;i < numOfpizzas; i++){
           
            let pizza = makePizza(pizzaData[i]);
            pizzasSpace.appendChild(pizza);
        }
    }

    function makePizza(pizzaInfo){

        let pizza = document.createElement("div");
        pizza.id =pizzaInfo.id;
        pizza.classList.add("pizza");


        pizza.innerHTML=      
     `<div class = "pizzaImg">
        <img src = ${pizzaInfo.image} alt = ${"pizzaImg:" + pizzaInfo.id} class = "imgFit">
      </div>
      <div class="pizzaInfo">
          <div class="pizzaTitle">${pizzaInfo.title}</div>
          <div class="pizzaIngredients">${pizzaInfo.ingredients}</div>
          <div class="pizzaPrice">${pizzaInfo.price}</div>
        </div>`;
        

        let buttonAdd = document.createElement("button");
        buttonAdd.innerHTML = "zamów";
        buttonAdd.addEventListener("click", addToChart);
        pizza.appendChild(buttonAdd);
    
        return pizza;
    }


    function addToChart(event){

        if(calculateAmount() > 49){
            alert("W przypadku zamówień powyżej 50 sztuk prosimy o kontakt telefoniczny");
        
        }
        else{

            let currentID = event.target.parentNode.id;
            
            const currentChartNode = chart.find(e => e.id === Number(currentID));

            if (currentChartNode) {
                currentChartNode.amount++;
            }
            else{
                chart.push({id: pizzaData[currentID-1].id, amount:1 });
            }

            refreshChart();
        }
    }

    function removeFromChart(event){
        let currentID = event.target.id;

        let current = chart.find(e => "btnDel" + e.id === currentID);

        if(current.amount > 1){
            current.amount -= 1;
        }
        else{
           let index = chart.indexOf(current);
            if (index > -1) {
                chart.splice(index, 1);
            }

        }
        refreshChart();

    }

    function refreshChart(){

        let priceSumCount = 0;

        if(chart.length === 0){
            chartSpace.innerHTML = `<p id="emptyChartText" style="display: block;">Głodny? Zamów naszą pizzę!!!</p>`;
        }
        else{
            chartSpace.innerHTML = "";
        }
    
        if(chart.length > 0){
            priceSum.classList.remove("hidden");
        }else{
            priceSum.classList.add("hidden");
        }

        chart.forEach(element => {
        
            priceSumCount += element.amount * Number(pizzaData[element.id - 1].price);

            let item = document.createElement("div");
            item.classList.add("chartItem");
            item.id=element.id;

            item.innerHTML = 
                `<div class="chartItemSection">
                    <p class="chartItemName">${pizzaData[element.id - 1].title}</p>
                    <p>${Number(pizzaData[element.id - 1].price).toFixed(2) + " zł"}</p>
                </div>
                <div class="chartItemSection">
                    <div>${"Ilość: " + element.amount}</div>
                    <button id="${"btnDel" + pizzaData[element.id - 1].id}">usuń</button>
                </div>`;

            chartSpace.appendChild(item);
            
            document.querySelector("#btnDel" + pizzaData[element.id - 1].id).addEventListener("click",removeFromChart);
           

        });

        priceSum.innerHTML = "Suma: " + priceSumCount.toFixed(2) + " zł";
    }

    function calculateAmount(){
        let value =0;

        chart.forEach(element =>{
            value += element.amount;
        });
        return value;
    }    
 
})();
