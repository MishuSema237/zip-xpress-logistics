
import sys

path = r'c:\Users\HP\Desktop\MISHAEL_SEMA_EKOM\Websites\GLOBALTRACK\global-track-courier\src\pages\Home.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the Redundant AnimatedCard and fix the block
# Find the start of the Branches section
target_search = 'Strategic locations across key international logistics hubs to serve you better.'
start_index = text.find(target_search)
if start_index == -1:
    print("Could not find branches target")
    sys.exit(1)

# Find the next </AnimatedCard>
first_ac_end = text.find('</AnimatedCard>', start_index)
# Find the next </AnimatedCard> (the broken one)
second_ac_end = text.find('</AnimatedCard>', first_ac_end + 1)

# We want to replace the whole block from first_ac_end to where it starts becoming messy
# Actually, let's just find the whole section and replace it.
section_start = text.rfind('<div className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">', start_index)
section_end = text.find('{/* How It Works Section */', start_index)

new_section = """<div className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="fade">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-zip-blue-800 dark:text-white sm:text-4xl">
                Zip Xpress Global Branches and WareHouses
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Strategic locations across key international logistics hubs to serve you better.
              </p>
            </div>
          </AnimatedCard>

          <div className="mt-8">
            <GlobalBranches variant="marquee" />
          </div>
        </div>
      </div>

      """

clean_text = text[:section_start] + new_section + text[section_end:]

# 2. Fix the end of the file (closing tags)
# Find the last CTA section
cta_start = clean_text.rfind('{/* Call to Action Section */}')
if cta_start == -1:
    # try without comment if not found
    cta_start = clean_text.rfind('className="bg-zip-red-600 dark:bg-zip-red-900 py-16"')

# Let's just find the end of the content and fix it.
# The previous view showed:
# 662:               <p className="mt-4 text-xl text-gray-300">
# ...
# 671:               <div className="mt-8 flex justify-center space-x-4">
# ...
# 682:         </div>
# 683:       </div>
# 684:     </div>
# 685:   );
# 686: };
# 687: 
# 688: export default Home;

# We want to make sure it ends with:
#         </div>
#       </AnimatedCard>
#     </div>
#   </div>
#     </div >
#   );
# };
# export default Home;

# Wait, the structure in the view was:
# <div min-h-screen>
#   ...
#   <div CTA>
#     <div max-w-7xl>
#       <AnimatedCard>
#         <div text-center>
#           ...
#         </div>
#       </AnimatedCard>
#     </div>
#   </div>
# </div>

footer_fix = """      </div>
    </div>
  );
};

export default Home;
"""

# Find the end of max-w-7xl in CTA
# The previous view showed redundant div at line 668: </div >
# Let's just replace from the end of AnimatedCard in CTA

last_ac_end = clean_text.rfind('</AnimatedCard>')
final_text = clean_text[:last_ac_end + 15] + "\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default Home;\n"

with open(path, 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Home.tsx fixed successfully with marquee and clean tags")
