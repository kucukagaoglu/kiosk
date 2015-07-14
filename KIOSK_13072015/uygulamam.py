from PyQt4.QtGui import *
from PyQt4.QtCore import *
from PyQt4 import uic

#from anapencere import Ui_Dialog

class uygulamam(QDialog):
    def __init__(self,ebeveyn=None):
        QWidget.__init__(self,ebeveyn)
 #      self.ui=Ui_Dialog()
 #      self.ui.setupUi(self)
        self.ui=uic.loadUi('anapencere.ui',self)

        self.numpad=numpad(self)
        self.connect(self.ui.pushButton_11,SIGNAL('pressed()'),self.acil)

    def acil(self):
        self.numpad.show()

class numpad(QDialog):
    def __init__(self,ebeveyn=None):
        QWidget.__init__(self,ebeveyn)
        self.ui=uic.loadUi('numpad.ui',self)

        self.pushButton_13.setEnabled(False)

        

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
            self.pushButton_13.setEnabled(False)
        
        if len(self.label.text())==11:
            self.pushButton_13.setEnabled(True)

        elif len(self.label.text())>11:
            self.sil()

    def sil(self):
        st=self.label.text()
        st=st[:-1]
        self.label.setText(st)
        self.digit_kontrol()
            

        


uyg=QApplication([])
form=uygulamam()
form.show()
uyg.exec_()
