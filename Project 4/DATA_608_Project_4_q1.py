'''
File: DATA 608 - Module 4 Question 1
Name: Joshua Sturm
Date: 03/18/2018
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
from scipy.stats.mstats import gmean

river = pd.read_csv("riverkeeper_data_2013.csv")

# Standardize date format
river.Date = pd.to_datetime(river.Date, format="%m/%d/%Y")

# Remove symbols (e.g. ">") in "EnteroCount" column
river.EnteroCount.replace(regex=True, inplace=True, to_replace=r'\D', value=r'')

# Convert EnteroCount column to integer
river.EnteroCount = river.EnteroCount.astype(int)

# Add a column showing mean entero count of that case
# river['Weighted Mean Entero Count'] = river.groupby(river.Date).\
#    apply(lambda x : np.mean(x.EnteroCount, x.SampleCount))

river['Gmean'] = gmean([river['EnteroCount'], river['SampleCount']])

# k = river.sort_values('EnteroCount').groupby('Date')

###################################################################
###  Dash Settings
###################################################################

app = dash.Dash()

app.layout = html.Div([
    html.Div([
        dcc.DatePickerSingle(
            id='my-date-picker-single',
            min_date_allowed=dt(2006, 9, 19),
            max_date_allowed=dt(2013, 10, 21),
            initial_visible_month=dt(2011, 1, 1),
            date=dt(2011, 1, 1),
        )]),
    html.Div([
        dcc.Graph(id='output-graph')
    ])
])


@app.callback(
    Output('output-graph', 'figure'),
    [Input('my-date-picker-single', 'date')])
def update_graph(date):
    #traces = []
    filtered_river = river[river.Date == date].sort_values(by=['EnteroCount'])
    if filtered_river.empty:
        print("No data available for selected date.")
    # for i in filtered_df.continent.unique():
    #     traces.append(go.Bar(
    #         x=filtered_river['Site'],
    #         y=filtered_river['EnteroCount']
    #     ))

    # return {
    #     'data': traces,
    #     'layout': go.Layout(
    #         title='test',
    #         hovermode='closest'
    #     )
    # }
    color = np.array(['rgb(255, 255, 255)'] * filtered_river.Gmean.shape[0])
    color[filtered_river.Gmean <= 30] = 'rgb(158, 160, 163)'
    color[filtered_river.Gmean > 30] = 'rgb(130, 0, 0)'

    return {
        'data': [
            {'x': filtered_river.Site, 'y': filtered_river.EnteroCount, 'type': 'bar', 'name': 'EnteroCount'},
            {'x': filtered_river.Site, 'y': filtered_river.Gmean, 'type': 'bar', 'name': 'Gmean', 'marker': dict(color=color.tolist())},
        ],
        'layout': go.Layout(
            showlegend = True,
            title = "List of spots for " + date + ". Gmean greater than 30 (marked in red) are unsafe."
            )
    }

if __name__ == '__main__':
    app.run_server(debug=True)
