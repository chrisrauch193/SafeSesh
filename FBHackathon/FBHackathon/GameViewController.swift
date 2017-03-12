//
//  MainViewController.swift
//  Add 1
//
//  Created by Reinder de Vries on 11-06-15.
//  Copyright (c) 2015 LearnAppMaking. All rights reserved.
//

import UIKit

class GameViewController: UIViewController
{
    @IBOutlet weak var numbersLabel:UILabel?
    @IBOutlet weak var inputField:UITextField?
    @IBOutlet weak var timeLabel:UILabel?
    
    var timer:Timer?
    var seconds:Int = 10
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        setRandomNumberLabel()
        updateTimeLabel()

        timer = Timer.scheduledTimer(timeInterval: 1.0, target:self, selector:#selector(onUpdateTimer), userInfo:nil, repeats:true)

        inputField?.addTarget(self, action: #selector(textFieldDidChange(textField:)), for:UIControlEvents.editingChanged)
        inputField?.becomeFirstResponder()
    }
    
    func textFieldDidChange(textField:UITextField)
    {
        if inputField?.text?.characters.count ?? 0 < 4
        {
            return
        }
        
        if  let numbers_text    = numbersLabel?.text,
            let input_text      = inputField?.text,
            let numbers         = Int(numbers_text),
            let input           = Int(input_text)
        {
            print("Comparing: \(input_text) minus \(numbers_text) == \(numbers - input)")
            
            if(numbers - input == 1111)
            {
                print("Correct!")
                
                let navigationController = self.presentingViewController
                
                self.dismiss(animated: true) {
                    let _ = navigationController?.dismiss(animated: true, completion: nil)
                }
            }
            else
            {
                print("Incorrect!")
                inputField?.text = ""
                setRandomNumberLabel()
            }
        }
    
        if(timer == nil)
        {
            timer = Timer.scheduledTimer(timeInterval: 1.0, target:self, selector:#selector(onUpdateTimer), userInfo:nil, repeats:true)
        }
    }
    
    func onUpdateTimer()
    {
        if(seconds > 0 && seconds <= 10)
        {
            seconds -= 1
            
            updateTimeLabel()
        }
        else if(seconds == 0)
        {
            self.dismiss(animated: true, completion: nil)
            
//            if(timer != nil)
//            {
//                timer!.invalidate()
//                timer = nil
//                
//                updateTimeLabel()
//                setRandomNumberLabel()
//            }   
        }
    }
    
    func updateTimeLabel()
    {
        if(timeLabel != nil)
        {
            let min:Int = (seconds / 60) % 60
            let sec:Int = seconds % 60
            
            let min_p:String = String(format: "%02d", min)
            let sec_p:String = String(format: "%02d", sec)
            
            timeLabel!.text = "\(min_p):\(sec_p)"
        }
    }
    
    func showHUDWithAnswer(isRight:Bool)
    {
        var imageView:UIImageView?
        
        if isRight
        {
            imageView = UIImageView(image: UIImage(named:"thumbs-up"))
        }
        else
        {
            imageView = UIImageView(image: UIImage(named:"thumbs-down"))
        }
        
//        if(imageView != nil)
//        {
//            hud?.mode = MBProgressHUDMode.customView
//            hud?.customView = imageView
//            
//            hud?.show(animated: true)
//            
//            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
//                self.hud?.hide(animated: true)
//                self.inputField?.text = ""
//            }
//        }
    }
    
    func setRandomNumberLabel()
    {
        numbersLabel?.text = generateRandomNumber()
    }
    
    func generateRandomNumber() -> String
    {
        var result:String = ""
        
        for _ in 1...4
        {
            let digit:Int = Int(arc4random_uniform(7) + 2)
            
            result += "\(digit)"
        }
        
        return result  
    }

    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
}
