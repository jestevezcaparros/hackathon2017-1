# JOTB Hackathon 2017 Development Framework
This document describes the setup of your development framework for the JOB Hackathon 2017.

To make it easier for you, we have place all the relevant documentation tools, libraries and exmples in this [git repository](https://github.com/ITRS-Group/hackathon2017.git).

Press the blue `Download` button at the right side of the screen and choose `Download Zip` option.

Decompress the file in your user folder and follow the instructions of the installation guide.

## Install the USB to Serial driver
Please, install the driver (regarding your OS) to communicate your computer with the Surfboard.

| OS | File | Link |
|----|------|------|
|OS X Sierra|[driver](CH34x_Install/OS\ X/CH34x_Install_V1.3.pkg)|[instructions](http://www.mblock.cc/posts/run-makeblock-ch340-ch341-on-mac-os-sierra)|
|OS X (older)|[driver](CH34x_Install/OS\ X/CH34x_Install.pkg)|[instructions](CH34x_Install/OS\ X/ReadMe.pdf)|

## Install the Arduino IDE
There are several frameworks to work with Arduino, but we recommend the Arduino IDE for a fast setup.

Download and install the [Arduino IDE 1.6.2](https://www.arduino.cc/en/Main/OldSoftwareReleases#previous) according to your operating system.

> Please note that Surfboard works with version [1.6.2](https://www.arduino.cc/en/Main/OldSoftwareReleases#previous).

Now you are ready to setup your Surfboard!

## Surfboard and tools setup
We will need to verify that both the Surfboard hardware and IDE are properly configured.

### Hardware configuration
Check that your Surfboard has the switch in the right position before you connect.
> In case that this switch is not in the right position, the Arduino IDE will not be able to connect to the surfboard to write the program.

### Arduino IDE
Open the Arduino IDE and add the libraries and configure the conection with the Surfboard.

#### Add libraries
Open the Arduino IDE. Please, verify that bridge library is installed. You can do this through the menu `Sketch > Include libraries > Manage libraries`. If it is not installed, please do it by selecting the latest version from the dropdown.

You will need to add all of the provided libraries at `Surfboard/libraries` directory through the menu `Sketch > Include libraries > Add .ZIP library`. Note that you can also add directories.

#### Setup surfboard connection
Connect the Surfboard to your PC/MAC and open Arduino IDE and check in your computer that the Surfboard serial communication port is available (e.g. in windows COMx).
From the menu, select:

* `Tools` > `Board` > `Arduino Nano`
* `Tools` > `Processor` > `ATmega328`
* `Tools` > `Port` > `###` The port where your Surfboard is connected to (e.g. COM4).

