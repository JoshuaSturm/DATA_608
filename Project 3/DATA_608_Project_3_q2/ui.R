# DATA 608 Project 3
# Question 2 UI
# Joshua Sturm
# 03/06/2018
#


library(shiny)

# Define UI for application that draws a stacked bar chart
shinyUI(fluidPage(
  
  # Application title
  titlePanel("State mortality rate over time by cause"),
  
  # Sidebar with selections for state and cause
  sidebarLayout(
    sidebarPanel(
       selectInput("State",
                   "State:",
                   unique(cdc$State)
                   ),
       selectInput("Cause",
                   "Cause:",
                   unique(cdc$ICD.Chapter)
       )
    ),
    
    # Show a plot of the generated distribution
    mainPanel(
       plotlyOutput("sbarPlot")
    )
  )
))
