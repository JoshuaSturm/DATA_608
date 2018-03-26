# DATA 608 Project 3
# Question 2 Server
# Joshua Sturm
# 03/06/2018
#

library(shiny)
library(tidyverse)
library(plotly)

# Read in dataset
cdc <- read.csv("cleaned-cdc-mortality-1999-2010-2.csv", stringsAsFactors = F)

# Calculate weighted national average for each year
cdc <- cdc %>%
  select(-4) %>%
  group_by(Year) %>%
  mutate(wavg = weighted.mean(Crude.Rate, Population)) %>%
  na.omit()

# Define server logic required to draw a stacked bar chart
shinyServer(function(input, output) {
   
  output$sbarPlot <- renderPlotly({
    cdc <- cdc %>%
      select(-4) %>%
      filter(State == input$State, ICD.Chapter == input$Cause) %>%
      gather(key, value, 4:5)
    # generate plot from inputs
    p <- ggplot(cdc, aes(x = Year, y = value, group = value, fill = key,
                         text = paste("State:", input$State, "<br>Year:", Year, "<br>Cause:", input$Cause, "<br>Value:", value))) +
      geom_bar(stat = "identity", position = "dodge") +
      ylab(input$Cause)
    
    if (!(any(cdc$ICD.Chapter == input$Cause & cdc$State == input$State))){
      stop("No data available for selected state and cause. Try a different query.")
    }
    ggplotly(p, tooltip = "text")
  })
  
})
