//
//  ColorTapViewController.swift
//  FBHackathon
//
//  Created by Dawand Sulaiman on 11/03/2017.
//  Copyright © 2017 CarrotApps. All rights reserved.
//

import UIKit

class ColorTapViewController: UIViewController {

    var timer:Timer?
    var seconds = 0
    var randomSecs = 0
    var chosenColor:UIColor?
    var startTimer = 0.0
    var endTimer = 0.0
    var finalResult = 0.0
    var turn = 1
    
    var colorNames = ["red", "green", "blue", "yellow", "orange"]
    var colors:[UIColor] = [UIColor.red, UIColor.green, UIColor.blue, UIColor.yellow, UIColor.orange]

    @IBOutlet var colorLabel: UILabel!
    @IBOutlet var result: UILabel!
    @IBOutlet var tryNumber: UILabel!
    
    @IBAction func screenTapped(_ sender: Any) {
        
        endTimer = CACurrentMediaTime()
        if startTimer == 0 { startTimer = endTimer}
        let subValue = endTimer - startTimer
        if subValue > 0 { finalResult += subValue }
        else { finalResult += 1.0 }
    
        turn += 1
        tryNumber.text = "#\(turn) out of 5"
        
        if turn == 6 {
            tryNumber.isHidden = true
            colorLabel.isHidden = true
            
            self.view.isUserInteractionEnabled = false
            self.view.backgroundColor = UIColor.white
            
            finalResult /= 5.0
            
            if finalResult < 0.5 {
                result.text = "Your average result is: \(String(format: "%.2f",finalResult)) seconds. \n Keep spending ✅"
                
                let navigationController = self.presentingViewController
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {

                    self.dismiss(animated: true) {
                        let _ = navigationController?.dismiss(animated: true, completion: nil)
                    }
                }
            }else{
                result.text = "Your average result is: \(String(format: "%.2f",finalResult)) seconds. \n You need to stop spending 🛑"
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    self.dismiss(animated: true, completion: nil)
                }
            }
        }
        else{
            result.text = "Average result: \(String(format: "%.2f",(finalResult/Double(turn)))) s"
            reset()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        turn = 1
        tryNumber.text = "#1 out of 5"
        reset()
    }
    
    func reset(){
        self.view.backgroundColor = UIColor.white
        
        let rNum = turn-1
        chosenColor = colors[rNum]
        colorLabel.text = "Tap when changed to \(colorNames[rNum])"
        
        seconds = Int(arc4random_uniform(5) + 1)
        print(seconds)
        timer = Timer.scheduledTimer(timeInterval: TimeInterval(seconds), target:self, selector:#selector(onUpdateTimer), userInfo:nil, repeats:false)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    func onUpdateTimer(){
        startTimer = CACurrentMediaTime()
        self.view.backgroundColor = chosenColor
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
