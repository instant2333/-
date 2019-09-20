#encoding=utf-8
import pymysql
import json
database = pymysql.connect("127.0.0.1" ,"root", "123456", "book_trade", charset='utf8');
cursor = database.cursor()
cursor.execute('SET CHARACTER SET utf8;')
list=[]
dict={}

def check_login(usr_name,passwd):
    cursor.execute("select usr_code from book_trade.usr_info where usr_name = '" +  usr_name+"'")
    rows =cursor.fetchall()
    print(passwd)
    if rows:
        print(rows[0][0])
        if(passwd  ==rows[0][0]):
            print("loginsuccess")
            return 'true'
        else :
            print("login failed")
            return 'false'
def check_register(name,passwd,passwd2,email):
    if((name=='') | (passwd.strip()=='') | (passwd2.strip()=='') | (email.strip()=='')):
        return '4'
    if(passwd!=passwd2):
        return '1'
    if(len(passwd)<8):
        return '5'
    if('@' not in email):
        return '2'
    cursor.execute("select * from book_trade.usr_info where usr_name = '" + name + "'")
    rows = cursor.fetchall()
    if rows :
        return '3'
    cmd="insert into book_trade.usr_info values ( '"+str(name)+"','"+str(passwd)+"','"+str(email)+"')"
    cursor.execute(cmd)
    database.commit()
    return '0'


def submit_sell(bookname,origin,sellprice,labels,intro,ISBN,publisher,username,image_url='./local/1.png'):
    cmd1 = "insert into book_trade.sell_books  (`book_name`, `sell_price`, `book_ISBN`, `sell_name` ,`book_img_url`"
    cmd2 =" values (' "+bookname+"','"+sellprice+"','"+ISBN+"','"+username+"','"+image_url+"'"
    if(origin):
        cmd1+=" ,`origin_price` "
        cmd2+=",'"+origin+"'"
    if(labels):
        cmd1 += " ,`book_labels` "
        cmd2 += ",'" + labels + "'"
    if (intro):
        cmd1 += " ,`book_intro` "
        cmd2 += ",'" + intro + "'"
    if (publisher):
        cmd1 += " ,`book_publisher` "
        cmd2 += ",'" + publisher + "'"
    cmd1+=")"
    cmd2+=")"
    cmd=cmd1+cmd2
    print(image_url)
    cursor.execute(cmd)
    database.commit()
    return '0'

def submit_buy(bookname,buyprice,ISBN,publisher,username):
    cmd1 = "insert into book_trade.buy_books  (`book_name`, `buy_price`, `buy_name` "
    cmd2 = " values (' " + bookname + "','" + buyprice +  "','" + username + "'"
    if (publisher):
        cmd1 += " ,`book_publisher` "
        cmd2 += ",'" + publisher + "'"
    if (ISBN):
        cmd1 += " ,`book_ISBN` "
        cmd2 += ",'" + ISBN + "'"

    cmd1+=")"
    cmd2+=")"
    cmd=cmd1+cmd2
    cursor.execute(cmd)
    database.commit()
    return '0'
def market_sell_data():
    cursor.execute("select book_name,book_intro,book_img_url,sell_name,record_id,sell_price from book_trade.sell_books where state = 0")
    rows = cursor.fetchall()
    list.clear()
    for temp in rows:
        dict.clear()
        dict['bookname'] = temp[0]
        dict['intro'] = temp[1]
        dict['url'] = temp[2]
        dict['seller'] = temp[3]
        dict['id']=temp[4]
        dict['sell_price'] = temp[5]
        list.append(json.dumps(dict))
    return json.dumps(list)
def search_book(search_book_name):
    cmd="select book_name,book_intro,book_img_url,sell_name,record_id,sell_price from book_trade.sell_books where state = 0 and book_name = ' "+search_book_name+"'"
    cursor.execute('SET character_set_connection=utf8;')
    cursor.execute(cmd)
    print(cmd)
    rows = cursor.fetchall()
    list.clear()
    for temp in rows:
        dict.clear()
        dict['bookname'] = temp[0]
        dict['intro'] = temp[1]
        dict['url'] = temp[2]
        dict['seller'] = temp[3]
        dict['id']=temp[4]
        dict['sell_price'] = temp[5]
        list.append(json.dumps(dict))
    return json.dumps(list)


    #return json.dumps(dict)
def market_buy_data():
    cursor.execute("select book_name,buy_name,record_id,buy_price from book_trade.buy_books where state = 0")
    rows = cursor.fetchall()
    list.clear()
    for temp in rows:
        dict.clear()
        dict['bookname'] = temp[0]
        dict['buyer'] = temp[1]
        dict['id']=temp[2]
        dict['buy_price'] = temp[3]
        list.append(json.dumps(dict))
    return json.dumps(list)
def user_order(username):
    cursor.execute("select book_name,book_img_url,record_id,state,sell_price from book_trade.sell_books where sell_name = '" + username + "'")
    rows = cursor.fetchall()
    list.clear()
    for temp in rows:
        dict.clear()
        dict['bookname'] = temp[0]
        dict['url'] = temp[1]
        dict['id'] = temp[2]
        dict['state'] = temp[3]
        dict["price"] = temp[4]
        dict["type"] = "sell"
        list.append(json.dumps(dict))
    cursor.execute("select book_name,record_id,state,buy_price from book_trade.buy_books where buy_name = '" + username + "'")
    rows = cursor.fetchall()
    for temp in rows:
        dict.clear()
        dict['bookname'] = temp[0]
        dict['id'] = temp[1]
        dict['state'] = temp[2]
        dict["price"] = temp[3]
        dict["type"] = "buy"
        list.append(json.dumps(dict))
    return json.dumps(list)
#撤销订单用
def del_order(record_id,type):
    cmd = "update book_trade." + type + "_books set state = '2' where record_id = " + str(record_id)
    cursor.execute(cmd)
    database.commit()
    return '0'
def book_detail(record_id,type):
    cmd = "select * from book_trade." + type + "_books where record_id = " + str(record_id)
    cursor.execute(cmd)
    rows = cursor.fetchall()
    temp=rows[0]
    dict.clear()
    if(type=="sell"):
        dict["id"] =temp[0]
        dict['bookname']=temp[1]
        dict['origin_price'] = temp[2]
        dict['price'] = temp[3]
        dict['labels'] = temp[4]
        dict['intro'] = temp[5]
        dict["url"] = temp[6]
        dict["ISBN"]=temp[7]
        dict["publisher"] = temp[8]
        dict["username"] = temp[9]
        dict["state"] = temp[10]
    elif(type=="buy"):
        dict["id"] = temp[0]
        dict['bookname'] = temp[1]
        dict['price'] = temp[2]
        dict["ISBN"] = temp[3]
        dict["publisher"] = temp[4]
        dict["username"] = temp[5]
        dict["state"] = temp[6]
    return json.dumps(dict)
def deal_sell(seller,buyer,price,id,deal_type):
    cmd1 = "insert into book_trade.trade_records  (`buy_name`, `sell_name`, `price`,`book_record_sell`,`deal_type`) "
    cmd2 = " values (' " + buyer + "','" + seller + "','" + str(price) + "','" + str(id) +  "','" +deal_type+"')"
    cmd = cmd1 + cmd2
    cursor.execute(cmd)
    cmd3 = "update book_trade.sell_books set state = '1' where record_id = " + str(id)
    cursor.execute(cmd3)
    database.commit()
    return '1'

def deal_buy(seller, buyer, price,id,deal_type):
    cmd1 = "insert into book_trade.trade_records  (`buy_name`, `sell_name`, `price`,`book_record_buy`,`deal_type`) "
    cmd2 = " values (' " + buyer + "','" + seller + "','" + str(price) + "','" + str(id)  + "','" +deal_type+"')"
    cmd = cmd1 + cmd2
    cursor.execute(cmd)
    cmd3 = "update book_trade.buy_books set state = '1' where record_id = " + str(id)
    cursor.execute(cmd3)
    database.commit()
    return '1'
def comments(record_id):
    cursor.execute("select usr_name,content from book_trade.comments where sell_record_id = "+str(record_id))
    rows = cursor.fetchall()
    list.clear()
    if rows:
        for temp in rows:
            dict.clear()
            dict['username'] = temp[0]
            dict['content'] = temp[1]
            list.append(json.dumps(dict))
    return json.dumps(list)

def push_comments(comment,username,id):
    cmd="insert into book_trade.comments  values (' " + str(id) + "','" + username + "','" + comment  + "')"
    cursor.execute(cmd)
    database.commit()












