import sys
import json


class Project():
    def __init__(self, configPath):
        # parse config file
        self._config = json.load(open(configPath))

        pass

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
