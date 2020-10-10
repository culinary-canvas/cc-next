import React from 'react'
import s from './cookies.module.scss'
import { PageHead } from '../../components/PageHead/PageHead'
import {GetStaticProps} from 'next'

export default function Cookies() {
  return (
    <>
      <PageHead noFollow noIndex />
      <main className={s.container}>
        <article className={s.content}>
          <h1>Cookie policy</h1>
          <p>
            This cookie policy (&quot;Policy&quot;) describes what cookies are
            and how and they&#039;re being used by the culinary-canvas.com
            website (&quot;Website&quot; or &quot;Service&quot;) and any of its
            related products and services (collectively, &quot;Services&quot;).
            This Policy is a legally binding agreement between you
            (&quot;User&quot;, &quot;you&quot; or &quot;your&quot;) and Culinary
            Canvas (&quot;Culinary Canvas&quot;, &quot;we&quot;, &quot;us&quot;
            or &quot;our&quot;). You should read this Policy so you can
            understand the types of cookies we use, the information we collect
            using cookies and how that information is used. It also describes
            the choices available to you regarding accepting or declining the
            use of cookies. For further information on how we use, store and
            keep your personal data secure, see our
            <a
              title="Culinary Canvas privacy policy"
              rel="nofollow"
              href="https://culinary-canvas.com/privacy"
            >
              Privacy Policy
            </a>
            .
          </p>
          <h2>What are cookies?</h2>
          <p>
            Cookies are small pieces of data stored in text files that are saved
            on your computer or other devices when websites are loaded in a
            browser. They are widely used to remember you and your preferences,
            either for a single visit (through a &quot;session cookie&quot;) or
            for multiple repeat visits (using a &quot;persistent cookie&quot;).
          </p>
          <p>
            Session cookies are temporary cookies that are used during the
            course of your visit to the Website, and they expire when you close
            the web browser.
          </p>
          <p>
            Persistent cookies are used to remember your preferences within our
            Website and remain on your desktop or mobile device even after you
            close your browser or restart your computer. They ensure a
            consistent and efficient experience for you while visiting the
            Website and Services.
          </p>
          <p>
            Cookies may be set by the Website (&quot;first-party cookies&quot;),
            or by third parties, such as those who serve content or provide
            advertising or analytics services on the Website (&quot;third party
            cookies&quot;). These third parties can recognize you when you visit
            our website and also when you visit certain other websites.
          </p>
          <h2>What type of cookies do we use?</h2>
          <h3>Analytical cookies</h3>
          <p>
            These cookies enable us and third party services to collect
            aggregated data for statistical purposes on how our visitors use the
            Website. These cookies do not contain personal information such as
            names and email addresses and are used to help us improve your user
            experience of the Website.
          </p>
          <h3>Social media cookies</h3>
          <p>
            Third party cookies from social media sites (such as Facebook,
            Twitter, etc) let us track social network users when they visit or
            use the Website and Services, or share content, by using a tagging
            mechanism provided by those social networks.
          </p>
          <p>
            These cookies are also used for event tracking and remarketing
            purposes. Any data collected with these tags will be used in
            accordance with our and social networks’ privacy policies. We will
            not collect or share any personally identifiable information from
            the user.
          </p>
          <h2>Do we use web beacons or tracking pixels?</h2>
          <p>
            Our emails may contain a &quot;web beacon&quot; (or &quot;tracking
            pixel&quot;) to tell us whether our emails are opened and verify any
            clicks through to links or advertisements within the email.
          </p>
          <p>
            We may use this information for purposes including determining which
            of our emails are more interesting to users and to query whether
            users who do not open our emails wish to continue receiving them.
          </p>
          <p>
            The pixel will be deleted when you delete the email. If you do not
            wish the pixel to be downloaded to your device, you should read the
            email in plain text view or with images disabled.
          </p>
          <h2>What are your cookie options?</h2>
          <p>
            If you don't like the idea of cookies or certain types of cookies,
            you can change your browser's settings to delete cookies that have
            already been set and to not accept new cookies. To learn more about
            how to do this or to learn more about cookies, visit
            <a
              title="internetcookies.org"
              href="https://www.internetcookies.org"
            >
              internetcookies.org
            </a>
          </p>
          <p>
            Please note, however, that if you delete cookies or do not accept
            them, you might not be able to use all of the features the Website
            and Services offer.
          </p>
          <h2>Changes and amendments</h2>
          <p>
            We reserve the right to modify this Policy or its terms relating to
            the Website and Services at any time, effective upon posting of an
            updated version of this Policy on the Website. When we do, we will
            revise the updated date at the bottom of this page. Continued use of
            the Website and Services after any such changes shall constitute
            your consent to such changes.
          </p>
          <h2>Acceptance of this policy</h2>
          <p>
            You acknowledge that you have read this Policy and agree to all its
            terms and conditions. By accessing and using the Website and
            Services you agree to be bound by this Policy. If you do not agree
            to abide by the terms of this Policy, you are not authorized to
            access or use the Website and Services.
          </p>
          <h2>Contacting us</h2>
          <p>
            If you would like to contact us to understand more about this Policy
            or wish to contact us concerning any matter relating to our use of
            cookies, you may send an email to
            &#105;&#110;f&#111;&#64;&#99;u&#108;i&#110;ar&#121;-&#99;an&#118;&#97;s.&#99;o&#109;
          </p>
          <p>This document was last updated on October 1, 2020</p>
        </article>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
