import sys
import json
import os
from FirmAnalyzer import unpacker


class Project():
    def __init__(self, configPath):
        '''
        Parse config file and Set the logger
        '''
        self._config = json.load(open(configPath))
        self._firmwarePath = self._config['firmwarePath']
        if os.path.isfile(self._firmwarePath):
            self._unpackFirmwarePath = unpackFirmware(self._firmwarePath)

    def Run(self):
        '''
        Run Project
        '''
        pass

    pass


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage' + sys.argv[0] + 'ConfigPath')
        sys.exit(0)
    else:
        configPath = sys.argv[1]
        proj = Project(configPath)
        proj.run()
