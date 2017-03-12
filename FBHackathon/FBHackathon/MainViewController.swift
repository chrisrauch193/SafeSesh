//
//  MainViewController.swift
//  FBHackathon
//
//  Created by Dawand Sulaiman on 11/03/2017.
//  Copyright © 2017 CarrotApps. All rights reserved.
//

import UIKit

class MainViewController: UIViewController {

    var amount = 0.0
    var timer:Timer?

    let USER_ID = "acc_00009CNhj7lD8LhVXxIhP7"
    
    @IBOutlet var unlockLimit: UILabel!
    @IBOutlet var colorTapBtn: UIButton!
    @IBOutlet var numberBtn: UIButton!
    @IBOutlet var numebrOfAttempts: UILabel!
    
    @IBOutlet var amountValue: UILabel!
    
    override func viewDidAppear(_ animated: Bool) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        numebrOfAttempts.text = "Attempts left: \(appDelegate.attempts)"
        
        if appDelegate.attempts == 0 {
            numberBtn.isHidden = true
            colorTapBtn.isHidden = true

            unlockLimit.isHidden = false
            unlockLimit.text = "You do not have any attempts left"
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        unlockLimit.isHidden = true
        numberBtn.isHidden = true
        colorTapBtn.isHidden = true
        numebrOfAttempts.isHidden = true
        
        timer = Timer.scheduledTimer(timeInterval: 2.0, target:self, selector:#selector(updateAmount), userInfo:nil, repeats:true)
        
        amountValue.text = "£\(String(format:"%.2f",self.amount))"
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateAmount() {
        let req = URLRequest(url:URL(string:"http://ungurianu.com/safesesh/amountleft?account_id=\(USER_ID)")!)
        
        let task = URLSession.shared.dataTask(with: req) { data, response, error in
            guard let data = data, error == nil else {                // check for fundamental networking error
                print("error=\(error)")
                return
            }
            
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response!)")
            }
            
            let responseString = String(data: data, encoding: .utf8)
            print("responseString = \(responseString!)")
            do {
                let obj = try JSONSerialization.jsonObject(with: data) as? [String: Any]
                print(obj!)
                self.amount = obj?["amount"] as! Double / 100.0
                
                print("amount in request: \(self.amount) ")
            } catch {
                print("Error deserializing JSON: \(error)")
            }
        }
        task.resume()
        
        print("amount outside: \(self.amount) ")
        self.amountValue.text = "£\(String(format:"%.2f",self.amount))"

        if amount < 1 {
            timer?.invalidate()
            
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            numebrOfAttempts.text = "Attempts left: \(appDelegate.attempts)"

            unlockLimit.isHidden = false
            numberBtn.isHidden = false
            colorTapBtn.isHidden = false
            numebrOfAttempts.isHidden = false
        }
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
}
