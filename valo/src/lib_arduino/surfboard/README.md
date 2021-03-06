# JOTB Hackathon 2017 Development Framework
This document describes the setup of your development framework for the JOB Hackathon 2017.

To make it easier for you, we have place all the relevant documentation tools, libraries and exmples in this [git repository](https://github.com/ITRS-Group/hackathon2017.git).

![](download.png)

Press the blue `Download` button at the right side of the screen and choose `Download Zip` option.

Decompress the file in your user folder and follow the instructions of the installation guide.

## Install the USB to Serial driver
Please, install the driver (regarding your OS) to communicate your computer with the Surfboard.

| OS Version | File | Link | Notes |
|------------|------|------|-------|
|Windows     | [driver](http://sparks.gogo.co.nz/assets/_site_/downloads/CH34x_Install_Windows_v3_4.zip) | [instructions](http://sparks.gogo.co.nz/ch340.html) |       |
|Linux       | [driver](http://sparks.gogo.co.nz/assets/_site_/downloads/CH340_LINUX.zip) | [instructions](http://sparks.gogo.co.nz/ch340.html) | Should be provided within your Linux kernel distribution |
|OS X Sierra |[driver](CH34x_Install/OS\ X/CH34x_Install_V1.3.pkg)|[instructions](http://www.mblock.cc/posts/run-makeblock-ch340-ch341-on-mac-os-sierra)|
|OS X (older)|[driver](CH34x_Install/OS\ X/CH34x_Install.pkg)|[instructions](CH34x_Install/OS\ X/ReadMe.pdf)|

## Install the Arduino IDE
There are several frameworks to work with Arduino, but we recommend the Arduino IDE for a fast setup.

Download and install the [Arduino IDE 1.6.2](https://www.arduino.cc/en/Main/OldSoftwareReleases#previous) according to your operating system.

> Please note that Surfboard works with version [1.6.2](https://www.arduino.cc/en/Main/OldSoftwareReleases#previous).

### Linux
Run the install.sh command

```$> sudo install.sh```

### Other OS
Run the provided installable.

## Surfboard and tools setup
Now you are ready to setup your Surfboard!  
We will need to verify that the Surfboard IDE and hardware are properly configured.

### Arduino IDE
Open the Arduino IDE and add the libraries and configure the conection with the Surfboard.

#### Adding libraries
You will need to add the Surfboard libraries before you start coding.

##### Adding libraries the easy way
First of all copy the Arduino folder at `userhome/Documents` in `Un*x` systems and under `My Documents` under Windows OS. This should add the libraries automatically. 

##### Adding libraries manually
If libraries are not listed under menu `Sketch > Import/Include libraries` in your Arduino IDE, you can add them manually by opening `Sketch > Import/Include libraries > Add .ZIP library` from the menu and select the directories under `Arduino/libraries`.

![](add_library.png)

##### Verifying bridge library installation
Verify that `bridge library` is also installed. You can do this through the menu `Sketch > Include libraries > Manage libraries`. 

![](manage_library.png)

If it is not installed, please do it by selecting the latest version from the dropdown. After the installation the label INSTALLED will appear in the library header.

![](bridge_library.png)

#### Setup surfboard connection
Connect the Surfboard to your PC/MAC and open Arduino IDE and check in your computer that the Surfboard serial communication port is available (e.g. in windows COMx).
From the menu, select:

1. `Tools` > `Board` > `Arduino Nano`
![](board.png)
2. `Tools` > `Processor` > `ATmega328`
![](processor.png)
3. `Tools` > `Port` > `###` The port where your Surfboard is connected to (e.g. COM4).
![](port.png)

### Hardware configuration
Wifi and uploading functionality are not available at the same time (see picture below). That means that you need to set the switch when you need to upload your program, and you will need to change the switch after the program is uploaded so that the Wifi is enabled.

![](wifi_flash.png)


## Hello IoT!
Let's move on and write our first IoT application.

Create a new Arduino project. You will see that a page appears showing two methods: `setup` and `loop`.

### Setup
In the setup method you have to define the configuration ports of the Surfboard considering the devices (Wifi, Serial, ...) / GPIOs (Leds, ...) you need for your program.

```
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}
```
> This will be only initialised once after every Arduino restart.

### Main loop
In the main loop you write the logic of your application.
The main code will be invoking this loop in an infinite loop. You can think of events programming oriented where the loop consume messages from the main event queue thus facilitating the handling of concurrence in the absence of multithreading on this embedded devices.
> Note: Think that most embedded systems do not have operating systems neither multiprocessing capabilities.

```
void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Hello IoT");
  delay(1000);
}
```

In this example, the `loop` method will be invoked every second.

### Debugging
Println is the way to debug in your Arduino IDE. You can show a terminal to debug your first hello world application.

## And now what? ...
Now that you have successfully build your first application, have a look at the Valo contributor [example]() and open a world of possibilities.