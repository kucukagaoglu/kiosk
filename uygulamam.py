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



uyg=QApplication([])
form=uygulamam()
form.show()
uyg.exec_()
