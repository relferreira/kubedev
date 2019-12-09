package utils

import (
	"errors"
	"fmt"
	"os"
	"syscall"
)

// GetProcessRunningStatus returns running process with pid
func GetProcessRunningStatus(pid int) (*os.Process, error) {
	proc, err := os.FindProcess(pid)
	if err != nil {
		return nil, err
	}

	//double check if process is running and alive
	//by sending a signal 0
	//NOTE : syscall.Signal is not available in Windows

	err = proc.Signal(syscall.Signal(0))
	if err == nil {
		return proc, nil
	}

	// if err == syscall.ESRCH {
	if err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("process not running")
	}

	// default
	return nil, errors.New("process running but query operation not permitted")
}
