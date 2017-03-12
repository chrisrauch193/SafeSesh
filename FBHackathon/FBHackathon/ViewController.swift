//
//  ViewController.swift
//  FBHackathon
//
//  Created by Dawand Sulaiman on 11/03/2017.
//  Copyright © 2017 CarrotApps. All rights reserved.

import UIKit


class ViewController: UIViewController, UIViewControllerTransitioningDelegate {

    var value:Double!
    
    let USER_ID = "acc_00009CNhj7lD8LhVXxIhP7"
    
    let SECRET_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaSI6Im9hdXRoY2xpZW50XzAwMDA5NFB2SU5ER3pUM2s2dHo4anAiLCJleHAiOjE0ODkzMzAxMDIsImlhdCI6MTQ4OTMwODUwMiwianRpIjoidG9rXzAwMDA5SUhmbE5qWmN5TjVob2xNUk4iLCJ1aSI6InVzZXJfMDAwMDlBS200eEFNdlpnUFQ3U21iUiIsInYiOiIyIn0.BqLtrT466M8MKCNjYFEml5sb4ytOjqEAJyQQaAB778I"
    
    let transition = BubbleTransition()

    @IBOutlet var startButton: SpringButton!
    @IBOutlet var stepper: UIStepper!
    @IBOutlet var stepperLabel: SpringLabel!
    
    @IBAction func startSesh(_ sender: UIStepper) {

        let destinationVC:MainViewController = self.storyboard?.instantiateViewController(withIdentifier: "MainVC") as! MainViewController
        destinationVC.amount = value
        
        var req = URLRequest(url: URL(string:"http://ungurianu.com/safesesh/start")!)
        
        req.httpMethod = "POST"
        
        let postString = "{\"account_id\":\"\(USER_ID)\", \"secret_token\":\"\(SECRET_TOKEN)\", \"amount\":\(value!)}"
        print(postString)
        req.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        req.httpBody = postString.data(using:.utf8)
        
        let task = URLSession.shared.dataTask(with: req) { data, response, error in
            guard let data = data, error == nil else {                                                 // check for fundamental networking error
                print("error=\(error)")
                return
            }
            
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
            }
            
            let responseString = String(data: data, encoding: .utf8)
            print("responseString = \(responseString)")
        }
        task.resume()
        
        
        
        // do the transition
        destinationVC.transitioningDelegate = self
        destinationVC.modalPresentationStyle = .custom
        
        self.present(destinationVC, animated: true, completion: nil)
    }
    
    @IBAction func stepperValueChanged(_ sender: UIStepper) {
        
        if sender.value > value {
            stepperLabel.animation = "pop"
        } else {
            stepperLabel.animation = "squeeze"
        }
        
        stepperLabel.text = "£\(String(format:"%.2f",sender.value))"
        value = sender.value
        
        stepperLabel.animate()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        value = stepper.value
        stepperLabel.text = "£\(String(format:"%.2f",value))"

        startButton.layer.cornerRadius = 5
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: UIViewControllerTransitioningDelegate
    
    public func animationController(forPresented presented: UIViewController, presenting: UIViewController, source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        transition.transitionMode = .present
        transition.startingPoint = startButton.center
        transition.bubbleColor = startButton.backgroundColor!
        return transition
    }
    
    public func animationController(forDismissed dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        transition.transitionMode = .dismiss
        transition.startingPoint = startButton.center
        transition.bubbleColor = startButton.backgroundColor!
        return transition
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
}
