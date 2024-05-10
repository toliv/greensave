export default function About() {
  return (
    <main className="min-h-screen bg-white text-black mt-20 p-8 lg:p-16">
      <div className="flex text-md lg:text-lg justify-start font-thin">
        <div className="p-2 lg:p-4 w-full lg:w-5/6">
          <div className="py-4">
            {`Hey there, we're Tony and Tyler, the Green`}
            <span className="text-standard-green">$ave</span> guys!
          </div>
          <div className="py-4">
            {`We've been following the water heater market for some time now and have noticed that there isn't any great way for customers to find the product that best fits their needs.`}
          </div>
          <div className="py-4">
            {`Data around expected water heating capacity, estimated price, and potential for long-term energy bill savings is hard to come by. Add in the new tax credits from the Inflation Reduction Act, and choosing which product to purchase becomes even more complicated.`}
          </div>
          <div className="py-4">
            So a few months ago, we decided to create our own project - Green
            <span className="text-standard-green ">$ave</span> - to help
            consumers and professionals quickly find the right water heater to
            suit their needs!
          </div>
          <div className="py-4">
            {`With just a 5 question survey, we recommend 3 types of water heaters:`}
          </div>
          <div className="py-4 px-6">
            <ol className="list-decimal">
              <li className="list-decimal">{`The best value today given a person's current setup`}</li>
              <li>
                {`The best water heater based on long term energy bill savings`}
              </li>
              <li>
                {`The best for the environment given a person's current setup`}
              </li>
            </ol>
          </div>
          <div className="py-4">{`Please use the tool entirely free of charge!`}</div>
          <div className="py-4">
            {`We hope you enjoy playing around with this as much as we've enjoyed building it. And if you have any feedback, please don't hesitate to share it at `}
            <span className="text-standard-green">
              <a href="mailto:info@trygreensave.com">info@trygreensave.com</a>
            </span>
            .
          </div>
          <div className="py-4">Cheers!</div>
        </div>
      </div>
    </main>
  );
}
