import pandas as pd
import datetime as dt

def count_gender_in_month(month: int, gender: str) -> int:
   """
   counts number of rows that have given month and gender
   """
   return len(df[(df['Month']==month) & (df['Gender']==gender)])

def count_total_in_month(month: int, total: str) -> int:
   """
   counts number of rows that have given month and gender
   """
   return len(df[(df['Month']==month)])

def count_race_in_month(month: int, race: str) -> int:
   """
   counts number of rows that have given month and gender
   """
   return len(df[(df['Month']==month) & (df['Race']==race)])

def count_mental_illness_in_month(month: int, mental: str) -> int:
   """
   counts number of rows that have given month and gender
   """
   return len(df[(df['Month']==month) & (df['Mental_illness']==mental)])

df = pd.read_json('police_data.csv')
df['Date'] = df['Date'].apply(lambda x: x.month)
month_labels = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 
                6: 'June', 7: 'July', 8: 'Aug',
                9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
df['Month'] = df['Date']
df['Month'] = df['Month'].apply(lambda x: month_labels[x])
#data['Date']=pd.to_datetime(data['Date'],format='%m/%d/%y %I:%M%p')
df = df[df['Gender'].str.len() > 0]

#converted data
agg = pd.DataFrame({'Month' : ['Jan','Feb','Mar','Apr','May','June','July','Aug',
                    'Sep','Oct','Nov','Dec'],
                   'Mental Illness' : map(lambda x: count_mental_illness_in_month(x, True), df.Month.unique()),
                   'No Mental Illness' : map(lambda x: count_mental_illness_in_month(x, False), df.Month.unique())})


agg.to_json('agg_mental.json')

