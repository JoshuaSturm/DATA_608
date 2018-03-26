'''
File: DATA 608 - Module 4 Question 2
Name: Joshua Sturm
Date: 03/21/2018
Last Modified: 03/21/2018


Import libraries
'''

import numpy as np
import pandas as pd
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import plotly.graph_objs as go
from datetime import datetime as dt

river = pd.read_csv("riverkeeper_data_2013.csv")

# Standardize date format
river.Date = pd.to_datetime(river.Date, format="%m/%d/%Y")

# Remove symbols (e.g. ">") in "EnteroCount" column
river.EnteroCount.replace(regex=True, inplace=True, to_replace=r'\D', value=r'')

# Convert EnteroCount column to integer
river.EnteroCount = river.EnteroCount.astype(int)

# k = river.sort_values('EnteroCount').groupby('Date')

###################################################################
###  Dash Settings
###################################################################

app = dash.Dash()

app.layout = html.Div([
    html.Div([

        html.Div([
            dcc.Dropdown(
                id='select-site-one',
                options=[{'label': i, 'value': i} for i in river.Site.unique()]
            )
        ],
            style={'width': '49%', 'display': 'inline-block'}),

        html.Div([
            dcc.Dropdown(
                id='select-site-two',
                options=[{'label': i, 'value': i} for i in river.Site.unique()]
            )
        ], style={'width': '49%', 'float': 'right', 'display': 'inline-block'})
    ], style={
        'borderBottom': 'thin lightgrey solid',
        'backgroundColor': 'rgb(250, 250, 250)',
        'padding': '10px 5px'
    }),

    html.Div([
        dcc.Graph(id='site-one-plot')
    ], style={'width': '49%', 'display': 'inline-block', 'padding': '0 20'}),
    html.Div([
        dcc.Graph(id='site-two-plot')
    ], style={'display': 'inline-block', 'width': '49%'})
])


# Left graph
@app.callback(
    Output('site-one-plot', 'figure'),
    [Input('select-site-one', 'value')])
def update_left_graph(value):
    filtered_river = river[river['Site'] == value]

    return {
        'data': [go.Scatter(
            x=filtered_river.FourDayRainTotal,
            y=filtered_river.EnteroCount,
            text=filtered_river.Date,
            customdata=filtered_river.Date,
            mode='markers',
            marker={
                'size': 15,
                'opacity': 0.5,
                'line': {'width': 0.5, 'color': 'white'}
            }
        )],
        'layout': go.Layout(
            xaxis={
                'title': 'Four day rain amount at' + filtered_river.Site
            },
            yaxis={
                'title': 'Entero Count at' + filtered_river.Site
            },
            margin={'l': 40, 'b': 30, 't': 10, 'r': 0},
            height=450,
            hovermode='closest',
            showlegend = True
        )
    }
@app.callback(
    Output('site-two-plot', 'figure'),
    [Input('select-site-two', 'value')])
def update_left_graph(value):
    filtered_river = river[river['Site'] == value]

    return {
        'data': [go.Scatter(
            x=filtered_river.FourDayRainTotal,
            y=filtered_river.EnteroCount,
            text=filtered_river.Date,
            customdata=filtered_river.Date,
            mode='markers',
            marker={
                'size': 15,
                'opacity': 0.5,
                'line': {'width': 0.5, 'color': 'white'}
            }
        )],
        'layout': go.Layout(
            xaxis={
                'title': 'Four day rain amount at' + filtered_river.Site
            },
            yaxis={
                'title': 'Entero Count at' + filtered_river.Site
            },
            margin={'l': 40, 'b': 30, 't': 10, 'r': 0},
            height=450,
            hovermode='closest',
            showlegend = True
        )
    }

if __name__ == '__main__':
    app.run_server(debug=True)
