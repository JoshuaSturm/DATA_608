#
# DATA 608 Project 3
# Question 1 UI
# Joshua Sturm
# 03/06/2018
#

library(shiny)

# Define UI for application that draws a histogram
shinyUI(fluidPage(
  
  # Application title
  titlePanel("2010 mortality rate by disease per State"),
  
  # Sidebar with a slider input for year selection
  sidebarLayout(
    sidebarPanel(
      
        # Select input for cause
        selectInput("Cause",
                    "Cause:",
                    unique(cdc$ICD.Chapter))
    ),
    # Graph bar chart
    mainPanel(
       plotlyOutput("barPlot")
    )
  )
))

# References
# https://deanattali.com/blog/building-shiny-apps-tutorial/