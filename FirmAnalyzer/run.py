import sys

from Logger import BarLogger,FileLogger

class Project(self,ConfigPath):
    def __init__(self):
        
    pass

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage' + sys.argv[0] + 'ConfigPath')
        sys.exit(0)
    else:
        ConfigPath = sys.argv[1]
        proj = Project(ConfigPath)
        proj.run()