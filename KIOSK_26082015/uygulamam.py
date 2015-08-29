#-*- coding: utf-8 -*-
import locale
locale.setlocale(locale.LC_ALL, '')
import os
from PyQt4.QtGui import *
from PyQt4.QtCore import *
from PyQt4 import uic
import res

#from anapencere import Ui_Dialog

class uygulamam(QDialog):
    def __init__(self,ebeveyn=None):
        QWidget.__init__(self,ebeveyn)
 #      self.ui=Ui_Dialog()
 #      self.ui.setupUi(self)
        self.ui=uic.loadUi('anapencere.ui',self)

        self.numpad=numpad(self)
        #self.connect(self.ui.pushButton_11,SIGNAL('pressed()'),self.acil)
        self.ui.pushButton_11.clicked.connect(lambda: self.acil('EMEKLİLİK YAŞ HESABI'))
        self.ui.pushButton_12.clicked.connect(lambda: self.acil('HİZMET DÖKÜMÜ'))
        self.ui.pushButton_13.clicked.connect(lambda: self.acil('NE ZAMAN EMEKLİ OLABİLİRİM?'))
        self.ui.pushButton_14.clicked.connect(lambda: self.acil('TEDAVİ BİLGİLERİ'))
        self.ui.pushButton_15.clicked.connect(lambda: self.acil('İLAÇ KULLANIM SÜRESİ'))

        # title caption u yok eder!!!
        self.setWindowFlags(Qt.FramelessWindowHint)
       # self.setWindowFlags(Qt.SplashScreen)
       # self.showFullScreen()
        
        
    def acil(self,mesaj):
        self.numpad.show()
        sender=self.sender()
        #print sender.text()
        print "gönderen:", sender.objectName()
        print "mesaj:", mesaj
        #self.numpad.label_aciklama.setText(sender.text())
        
        self.numpad.label_aciklama.setText(mesaj.decode('utf-8'))
        
        
class sonuclar(QDialog):
    def __init__(self,ebeveyn=None):
        QWidget.__init__(self,ebeveyn)
        self.ui=uic.loadUi('sonuc.ui',self)

      

    def kapat(self):
        self.close()
        print "kapattik!"
        

class numpad(QDialog):
    def __init__(self,ebeveyn=None):
        QWidget.__init__(self,ebeveyn)
        self.ui=uic.loadUi('numpad.ui',self)

        self.btn_tamam.setEnabled(False)
        self.sonuc=sonuclar(self)
        self.btn_tamam.clicked.connect(lambda:self.sonuc_goster(self.label_aciklama.text()))#     self.ui.setWindowFlags(Qt.FramelessWindowHint)
        
       # self.ui.pushButton_13.clicked.connect(lambda: self.acil('NE ZAMAN EMEKLİ OLABİLİRİM?'))
        self.setWindowFlags(Qt.SplashScreen)
       # self.connect(

    def geri(self):
        self.label.setText("")
        self.label_aciklama.setText("")
        self.close()
        


    def tikla1(self):
        self.label.setText(self.label.text()+"1")
        self.digit_kontrol()
        
    def tikla2(self):
        self.label.setText(self.label.text()+"2")
        self.digit_kontrol()
    
    def tikla3(self):
        self.label.setText(self.label.text()+"3")
        self.digit_kontrol()
        
    def tikla4(self):
        self.label.setText(self.label.text()+"4")
        self.digit_kontrol()
        
    def tikla5(self):
        self.label.setText(self.label.text()+"5")
        self.digit_kontrol()
        
    def tikla6(self):
        self.label.setText(self.label.text()+"6")
        self.digit_kontrol()

    def tikla7(self):
        self.label.setText(self.label.text()+"7")
        self.digit_kontrol()

    def tikla8(self):
        self.label.setText(self.label.text()+"8")
        self.digit_kontrol()
        
    def tikla9(self):
        self.label.setText(self.label.text()+"9")
        self.digit_kontrol()
        
    def tikla0(self):
        self.label.setText(self.label.text()+"0")
        self.digit_kontrol()
        

    def digit_kontrol(self):
        
        if len(self.label.text())<11:
            self.btn_tamam.setEnabled(False)
        
        if len(self.label.text())==11:
            self.btn_tamam.setEnabled(True)

        elif len(self.label.text())>11:
            self.sil()

    def sil(self):
        st=self.label.text()
        st=st[:-1]
        self.label.setText(st)
        self.digit_kontrol()
        
    def sonuc_goster(self,aciklama):
        sender=self.sender()
        self.label.setText("")
        self.sonuc.show()
        self.sonuc.label.setText(aciklama)

        

        print "button %s was pressed" % sender.text()
        self.close()
        


        


uyg=QApplication([])
uyg.setStyle('cleanlooks')
form=uygulamam()
form.show()
uyg.exec_()
