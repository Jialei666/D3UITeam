function gettimenow(){        //��õ�ǰʱ��
        
        var myDate = new Date();
        Year = myDate.getFullYear();
        Month = myDate.getMonth();
        Day = myDate.getDate();
        Hour = myDate.getHours();
        //alert(Hour);
        Min = myDate.getMinutes();
        Time = ( new Date(Year,Month,Day,Hour,Min)).getTime();
        Time = Time/1000;
}