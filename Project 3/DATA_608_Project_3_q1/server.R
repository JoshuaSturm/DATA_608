#
# DATA 608 Project 3
# Question 1 Server
# Joshua Sturm
# 03/06/2018
#

library(shiny)
library(tidyverse)
library(plotly)

# Read in the dataset
cdc <- read.csv("cleaned-cdc-mortality-1999-2010-2.csv", stringsAsFactors = F)
# Keep only cases from 2010
# From a random sample, we'll use 'Diseases of the circulatory system'

# Convert to character to simplify listing input
#cdc$ICD.Chapter <- as.character(cdc$ICD.Chapter)

cdc <- cdc %>%
  filter(Year == 2010) %>%
  select(1, 2, 6) %>%
  group_by(ICD.Chapter)

# Define server logic required to draw a histogram
shinyServer(function(input, output) {
  
  output$barPlot <- renderPlotly({
    cdc <- cdc %>%
      filter(ICD.Chapter == input$Cause)
    p <- ggplot(cdc, aes(x = reorder(State, -Crude.Rate), y = Crude.Rate, fill = Crude.Rate,
                         text = paste("State:", State, "<br>Crude Rate:", Crude.Rate))) +
      geom_bar(stat = "identity") +
      ylab(input$Cause) +
      theme(axis.text.x = element_text(angle = 90),
            axis.text.y = element_text(angle = 90))
    
    ggplotly(p, tooltip = "text")
    
  })
  
})
