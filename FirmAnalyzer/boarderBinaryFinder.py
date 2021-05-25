import subprocess as sp
import angr
from sklearn.cluster import DBSCAN


def binaryFinder(firmwarePath):
    '''
    find binaries in the rootfs using find command
    return all the binaries found in the rootfs
    '''
    command = 'find ' + firmwarePath + ' '
    command += "-executable -type f -exec file {} \; | grep -iv image | grep -iv text | awk -F':' '{print $1}'"
    # Run subprocess and get the standard output
    cp = sp.run(command, stdout=sp.PIPE, stdin=sp.PIPE, shell=True)
    # Preprocess the stdout from byte to str
    binaryList = str(cp.stdout)[2:-1].split('\\n')[:-1]
    return binaryList


def boarderBinaryFinder(binaryList):
    '''
    find boarder binary. Using DBSCAN on five features:#bb,#br,#cmp,#net,#conn to compute parsing score
    '''
    binaryAnalyzerList = []
    for binary in binaryList:
        ba = binaryAnalyzer(binary)
        binaryAnalyzerList.append(ba)


class binaryAnalyzer():
    '''
    holds arguments for binary to perform DBSCAN
    '''
    def __init__(self, binary):
        # args to feed DBSCAN
        self.binary = binary
        self.basicBlockNum = 0
        self.branchNum = 0
        self.compareNum = 0
        self.networkMark = 0
        self.connectMark = 0

        # angr objects
        self.proj = angr.Project(self.binary, auto_load_libs=False)
        self.cfg = self.proj.analyses.CFGFast()

    def getBasicBlock(self, func, funcAddr):
        '''
        get the number of basic blocks of a function using cfg's info
        '''
        self.basicBlockNum = len(self.cfg.nodes())

    def getBtanch(self, func, funcAddr):
        '''
        get the number of branches of a function using cfg's info
        '''
        pass


if __name__ == '__main__':
    '''
    test functionality
    '''
    print(binaryFinder('/home/cascades/FirmVulHub/squashfs-root'))
    print(
        boarderBinaryFinder(
            '/home/cascades/FirmVulHub/squashfs-root/sbin/httpd'))
