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
df = df[df['Race'].str.len() > 0]

#converted data
# agg = pd.DataFrame({'Total':[],
#                    'Asian' : map(lambda x: count_race_in_month(x, 'Asian'), df.Month.unique()),
#                    'Black' : map(lambda x: count_race_in_month(x, 'Black'), df.Month.unique()),
#                    'Hispanic' : map(lambda x: count_race_in_month(x, 'Hispanic'), df.Month.unique()),
#                    'Other' : map(lambda x: count_race_in_month(x, 'Other'), df.Month.unique()),
#                    'Native' : map(lambda x: count_race_in_month(x, 'Native'), df.Month.unique()),
#                    'White' : map(lambda x: count_race_in_month(x, 'White'), df.Month.unique())})
df_out = df.groupby(by=("Race"))["Gender"].agg('count').reset_index()
df_out.columns = ["name", "value"]
print(df_out)


df_out.to_csv('race_agg.csv', encoding='utf-8', index=False)